import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { seedProfiles } from './swipeRoutes.js';

const port = Number(process.env.PORT || 4173);
let localMongo;
let listener;

async function stop() {
  listener?.close();
  await mongoose.disconnect();
  await localMongo?.stop();
}

try {
  let uri = process.env.MONGODB_URI;
  if (!uri && process.argv.includes('--local')) {
    const { MongoMemoryServer } = await import('mongodb-memory-server-core');
    const dbPath = fileURLToPath(new URL('../.data/mongo/', import.meta.url));
    mkdirSync(dbPath, { recursive: true });
    localMongo = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger' } });
    uri = localMongo.getUri('uit_lab4_hw3');
  }
  if (!uri) throw new Error('Thiếu MONGODB_URI. Cấu hình .env hoặc chạy npm run dev.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await seedProfiles();

  listener = await new Promise((resolve, reject) => {
    const server = createApp().listen(port, '127.0.0.1', () => resolve(server));
    server.once('error', reject);
  });
  console.log('HW3 API: http://127.0.0.1:' + port);
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      await stop();
      process.exitCode = 0;
    });
  }
} catch (error) {
  console.error(error.message);
  await stop();
  process.exitCode = 1;
}
