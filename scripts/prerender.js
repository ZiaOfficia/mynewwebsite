/* ============================================================
   PRERENDER — static HTML for every public route
   ============================================================
   Runs after `vite build` + `vite build --ssr`. For each route it
   renders the app to a string, injects the markup and Helmet's head
   tags into dist/index.html, and writes dist/<route>/index.html.

   Vercel serves those files directly; the SPA rewrite in vercel.json
   only catches paths with no matching file.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');
const distDir   = path.join(root, 'dist');

/* pathToFileURL — a bare Windows path like C:\… is not a valid ESM specifier. */
const importFrom = (rel) => import(pathToFileURL(path.join(root, rel)).href);

const { render }        = await importFrom('dist-ssr/entry-server.js');
const { PUBLIC_ROUTES } = await importFrom('src/seo/seo.config.js');

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const HEAD_BLOCK = /<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/;

let written = 0;

for (const route of PUBLIC_ROUTES) {
  const { html, head } = render(route);

  const page = template
    .replace(HEAD_BLOCK, head)
    .replace('<!--app-html-->', html);

  const outDir = route === '/' ? distDir : path.join(distDir, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);

  const kb = (Buffer.byteLength(page) / 1024).toFixed(1);
  console.log(`  prerendered  ${route.padEnd(30)} ${kb} kB`);
  written++;
}

/* The SSR bundle is a build artifact — it must not ship. */
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`\n✓ ${written} routes prerendered\n`);
