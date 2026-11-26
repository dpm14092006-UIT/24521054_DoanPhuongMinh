import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SwipeDeck from './SwipeDeck.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main id="main" className="shell site-main">
      <h1>HW2 · Bộ thẻ vuốt</h1>
      <SwipeDeck />
    </main>
  </StrictMode>,
);
