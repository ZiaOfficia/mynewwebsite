/* ============================================================
   /sitemap.xml — generated at build time, in strict schema order
   (loc, lastmod, changefreq, priority, then image entries)
   ============================================================
   • Every public page from seo.config.js, plus every published
     blog post (drafts are never listed)
   • <lastmod>: the post's date for blog posts, the "updated" date
     for legal pages, the newest post for /blog, SITE_UPDATED for
     everything else
   • Image entries: project screenshots on /projects and the home
     page, cover images on posts, the share image on the home page
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ROUTE_SEO, SITE_URL, SITE_UPDATED, OG_IMAGE, absoluteUrl } from '@/seo/seo.config.js';
import { getPostSummaries } from '@/lib/blog.js';
import { getPreviews } from '@/lib/previews.js';

function legalUpdated(name) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'legal', `${name}.md`), 'utf8');
    const d = matter(raw).data.updated;
    return d instanceof Date ? d.toISOString().slice(0, 10) : String(d);
  } catch {
    return SITE_UPDATED;
  }
}

function entries() {
  const posts = getPostSummaries();
  const newestPost = posts[0]?.updated || posts[0]?.date || SITE_UPDATED;
  const projectImages = getPreviews().map((slug) => `${SITE_URL}/projects/${slug}.jpg`);

  const pages = Object.entries(ROUTE_SEO).map(([route, seo]) => {
    let lastModified = SITE_UPDATED;
    if (route === '/blog') lastModified = newestPost > SITE_UPDATED ? newestPost : SITE_UPDATED;
    if (seo.legal) lastModified = legalUpdated(seo.legal);

    const images =
      route === '/' ? [OG_IMAGE, ...projectImages.slice(0, 4)] :
      route === '/projects' ? projectImages :
      undefined;

    return {
      url: absoluteUrl(route),
      lastModified,
      changeFrequency: seo.changefreq,
      priority: seo.priority,
      ...(images ? { images } : {}),
    };
  });

  const postEntries = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updated || post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
    ...(post.cover ? { images: [`${SITE_URL}${post.cover}`] } : {}),
  }));

  return [...pages, ...postEntries].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const dynamic = 'force-static';

export function GET() {
  const body = entries().map((e) => [
    '  <url>',
    `    <loc>${esc(e.url)}</loc>`,
    `    <lastmod>${esc(e.lastModified)}</lastmod>`,
    `    <changefreq>${esc(e.changeFrequency)}</changefreq>`,
    `    <priority>${Number(e.priority).toFixed(1)}</priority>`,
    ...(e.images || []).map((src) => `    <image:image><image:loc>${esc(src)}</image:loc></image:image>`),
    '  </url>',
  ].join('\n')).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
