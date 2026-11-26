import express from 'express';
import { handleError } from './common.js';
import { swipeRouter } from './swipeRoutes.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.get('/', (_req, res) => res.json({
    service: 'HW3 · Swipe Deck API',
    endpoints: ['GET /api/profiles', 'GET /api/swipes?sessionId=<UUID>',
      'POST /api/swipe', 'POST /api/swipe/undo'],
  }));
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  }, express.json({ limit: '16kb' }), swipeRouter);
  app.use((_req, res) => res.status(404).json({ error: 'API không tồn tại.' }));
  app.use(handleError);
  return app;
}
