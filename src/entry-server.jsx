/* ============================================================
   SSR ENTRY — used only at build time by scripts/prerender.js
   ============================================================
   Renders a route to an HTML string plus the head tags Helmet
   collected during that render.
   ============================================================ */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';
import './art.css';

export function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  /* `prioritizeSeoTags` on <Helmet> moves title/canonical/OG/Twitter into
     helmet.priority so they render first in <head>. They are removed from
     meta/link/script, so priority must be emitted or they are lost. */
  const head = [
    helmet?.priority?.toString(),
    helmet?.title?.toString(),
    helmet?.meta?.toString(),
    helmet?.link?.toString(),
    helmet?.script?.toString(),
  ]
    .filter(Boolean)
    .join('\n    ');

  return { html, head, htmlAttributes: helmet?.htmlAttributes?.toString() || '' };
}
