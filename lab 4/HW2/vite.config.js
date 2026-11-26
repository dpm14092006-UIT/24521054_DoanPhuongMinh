import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'SWIPE_');
  const proxy = mode === 'api' ? { '/api': process.env.SWIPE_API_TARGET || env.SWIPE_API_TARGET || 'http://127.0.0.1:4173' } : undefined;
  return { plugins: [react()], server: { proxy }, preview: { proxy } };
});
