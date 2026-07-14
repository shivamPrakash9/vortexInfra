import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const container = document.getElementById('root')!;

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If the HTML already exists (prerendered for production), hydrate it!
// Otherwise, render normally (for local development).
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  const root = createRoot(container);
  root.render(app);
}