import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { after, before, test } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import { createApp } from '../server/app.js';
import { seedProfiles } from '../server/swipeRoutes.js';

let database;
let listener;
let url;

before(async () => {
  database = await MongoMemoryServer.create();
  await mongoose.connect(database.getUri('hw3_test'));
  await seedProfiles();
  listener = createApp().listen(0, '127.0.0.1');
  await once(listener, 'listening');
  url = 'http://127.0.0.1:' + listener.address().port;
});

after(async () => {
  listener?.close();
  await mongoose.disconnect();
  await database?.stop();
});

const get = (path) => fetch(url + path).then((response) => response.json());
const post = (path, body) => fetch(url + path, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('API đọc hồ sơ, lưu MongoDB, chống trùng phiên bản và hoàn tác LIFO', async () => {
  const profiles = await get('/api/profiles');
  assert.equal(profiles.length, 5);

  const sessionId = randomUUID();
  const path = '/api/swipes?sessionId=' + sessionId;
  const first = { sessionId, revision: 0, profileId: profiles[0].id, direction: 'right' };
  const concurrent = await Promise.all([post('/api/swipe', first), post('/api/swipe', first)]);
  assert.deepEqual(concurrent.map(({ status }) => status).sort(), [201, 409]);

  const invalid = await post('/api/swipe', { ...first, direction: 'sideways' });
  assert.equal(invalid.status, 400);

  const second = await post('/api/swipe', { ...first, revision: 1, profileId: profiles[1].id, direction: 'up' });
  assert.equal(second.status, 201);
  assert.deepEqual((await get(path)).history.map(({ direction }) => direction), ['right', 'up']);
  assert.equal((await post('/api/swipe/undo', { sessionId, revision: 2 })).status, 200);
  assert.deepEqual((await get(path)).history, [{ profileId: profiles[0].id, direction: 'right' }]);
  assert.deepEqual(await get('/api/swipes?sessionId=' + randomUUID()), { revision: 0, history: [] });
});
