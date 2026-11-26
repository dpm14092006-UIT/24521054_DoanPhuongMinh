import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import express from 'express';
import mongoose from 'mongoose';
import { appealRouter } from './appealRoutes.js';
import { handleError } from './common.js';
import { seedProfiles, swipeRouter } from './swipeRoutes.js';

const dev = process.argv.includes('--dev');
const local = process.argv.includes('--local');
const root = new URL('../', import.meta.url);
const index = fileURLToPath(new URL('dist/index.html', root));
const port = Number(process.env.PORT || 4174);

if (!dev && !existsSync(index)) {
  console.error('Chưa có bản build. Hãy chạy npm run build trước.');
  process.exit(1);
}

let localMongo;
let vite;
let listener;

async function stop() {
  listener?.close();
  await vite?.close();
  await mongoose.disconnect();
  await localMongo?.stop();
}

try {
  let uri = process.env.MONGODB_URI;
  if (!uri && local) {
    const { MongoMemoryServer } = await import('mongodb-memory-server-core');
    const dbPath = fileURLToPath(new URL('.data/mongo/', root));
    mkdirSync(dbPath, { recursive: true });
    localMongo = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger' } });
    uri = localMongo.getUri('uit_lab4');
  }
  if (!uri) throw new Error('Thiếu MONGODB_URI. Tạo .env từ .env.example hoặc chạy npm run demo.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await seedProfiles();

  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  }, express.json({ limit: '16kb' }), swipeRouter, appealRouter);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API không tồn tại.' }));
  if (dev) {
    const { createServer } = await import('vite');
    vite = await createServer({ server: { middlewareMode: true } });
    app.use(vite.middlewares);
  } else {
    app.use('/assets', express.static(fileURLToPath(new URL('dist/assets/', root)), { immutable: true, maxAge: '1y' }));
    app.use(express.static(fileURLToPath(new URL('dist/', root)), { index: false, maxAge: '1h' }));
    app.get('/{*path}', (_req, res) => res.set('Cache-Control', 'no-cache').sendFile(index));
  }
  app.use(handleError);
  listener = await new Promise((resolve, reject) => {
    const server = app.listen(port, '127.0.0.1', () => resolve(server));
    server.once('error', reject);
  });
  console.log(`Lab 4: http://localhost:${port}`);
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      await stop();
      process.exit(0);
    });
  }
} catch (error) {
  console.error(error.message);
  await stop();
  process.exitCode = 1;
}
