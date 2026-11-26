import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import express from 'express';
import { photos, photosInCategory } from '../src/photos.js';

const dist = new URL('../dist/', import.meta.url);
const index = new URL('index.html', dist);
const ssr = new URL('../dist-ssr/entry-server.js', import.meta.url);
const port = Number(process.env.PORT || 4171);

if (!existsSync(index) || !existsSync(ssr)) {
  console.error('Hãy chạy npm run build trước.');
  process.exit(1);
}

const template = readFileSync(index, 'utf8');
const { renderGallery } = await import(ssr.href);
const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use('/assets', express.static(fileURLToPath(new URL('assets/', dist)), { immutable: true, maxAge: '1y' }));
app.use(express.static(fileURLToPath(dist), { index: false, maxAge: '1h' }));
app.use(['/assets', '/photos'], (_req, res) => res.sendStatus(404));
app.get('/{*path}', (req, res) => {
  if (['/', '/gallery'].includes(req.path.replace(/(.)\/$/, '$1'))) {
    const selected = photos.find(({ id }) => id === req.query.photoId);
    const images = selected ? [selected.id + '.webp'] : photosInCategory(req.query.category).slice(0, 2)
      .map(({ id }) => id + '-thumb.webp');
    for (const name of images) res.append('Link', '</photos/' + name + '>; rel=preload; as=image; fetchpriority=high');
  }
  const html = template.replace('<div id="root"></div>', () => '<div id="root">' + renderGallery(req.originalUrl) + '</div>');
  res.set('Cache-Control', 'no-cache').type('html').send(html);
});

app.listen(port, '127.0.0.1', () => console.log('HW1: http://127.0.0.1:' + port + '/gallery'));
