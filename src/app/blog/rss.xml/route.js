import { getPostSummaries } from '@/lib/blog.js';
import { SITE_URL, SITE_NAME } from '@/seo/seo.config.js';

export const dynamic = 'force-static';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const items = getPostSummaries().map((p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.excerpt)}</description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME} blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Practical guides on websites, SEO, social media and Google Ads from the HiBrands engineers.</description>
    <language>en-in</language>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
