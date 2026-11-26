import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

export function renderGallery(location) {
  return renderToString(
    <StaticRouter location={location}>
      <App />
    </StaticRouter>,
  );
}
