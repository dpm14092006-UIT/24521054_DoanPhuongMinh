import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { PUBG_VN_SQUADS } from './src/data/squads.js';

function createMockTelemetryPlugin() {
  function registerMiddleware(server) {
    server.middlewares.use('/api/telemetry', (req, res, next) => {
      if (req.method !== 'GET') {
        next();
        return;
      }

      const url = new URL(req.url ?? '/', 'http://localhost');
      const squadId = url.searchParams.get('squadId');
      const squad = PUBG_VN_SQUADS.find((item) => item.id === squadId);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');

      const delay = 1800 + Math.floor(Math.random() * 1400);
      const timer = setTimeout(() => {
        if (res.destroyed) return;

        if (!squad) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: 'Không tìm thấy đội tuyển.' }));
          return;
        }

        const hasSatelliteRisk = ['Erangel', 'Miramar'].includes(squad.map);
        const packetLost = hasSatelliteRisk && Math.random() < 0.35;

        if (packetLost) {
          res.statusCode = 504;
          res.end(JSON.stringify({
            message: 'Satellite packet timeout - Blue Zone signal lost',
          }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({
          ...squad,
          receivedAt: new Date().toISOString(),
        }));
      }, delay);

      res.on('close', () => clearTimeout(timer));
    });
  }

  return {
    name: 'pvs-mock-telemetry',
    configureServer: registerMiddleware,
    configurePreviewServer: registerMiddleware,
  };
}

export default defineConfig({
  plugins: [react(), createMockTelemetryPlugin()],
});
