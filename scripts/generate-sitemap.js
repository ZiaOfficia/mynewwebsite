/* ============================================================
   SITEMAP GENERATOR
   ============================================================
   Derives sitemap.xml from ROUTE_SEO so a new route can never be
   added to the app and forgotten in the sitemap.

   lastmod uses the file mtime of each route's source file where one
   can be resolved, falling back to the build date — Google only
   trusts lastmod when it reflects real content changes.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');

/* pathToFileURL — a bare Windows path like C:\… is not a valid ESM specifier. */
const { ROUTE_SEO, SITE_URL, absoluteUrl } =
  await import(pathToFileURL(path.join(root, 'src/seo/seo.config.js')).href);

/* Map a route to the source file that owns its content. */
const SOURCE_FILE = {
  '/':        'src/pages/Home.jsx',
  '/about':   'src/pages/AboutPage.jsx',
  '/contact': 'src/pages/ContactPage.jsx',
};
const SERVICE_SOURCE = 'src/data/index.js';

/* Last commit date for a file — the honest signal for lastmod. */
function lastModified(route) {
  const file = SOURCE_FILE[route] || (route.startsWith('/services/') ? SERVICE_SOURCE : null);
  if (file) {
    try {
      const iso = execSync(`git log -1 --format=%cs -- "${file}"`, {
        cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    } catch { /* not a git repo, or file never committed */ }
  }
  return new Date().toISOString().slice(0, 10);
}

const urls = Object.entries(ROUTE_SEO)
  .map(([route, meta]) => `  <url>
    <loc>${absoluteUrl(route)}</loc>
    <lastmod>${lastModified(route)}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority.toFixed(1)}</priority>
  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`✓ sitemap.xml — ${Object.keys(ROUTE_SEO).length} URLs (${SITE_URL})`);
