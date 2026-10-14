/* ============================================================
   BLOG — reads Markdown posts from /content/blog
   ============================================================
   One file per post: content/blog/<slug>.md
   The file name is the URL: content/blog/local-seo.md → /blog/local-seo

   Front matter (between the --- lines at the top of the file):
     title:    Post title (required)
     excerpt:  One or two sentences for listings and Google (required)
     date:     2026-10-14 (required, YYYY-MM-DD)
     category: SEO | Social Media | Google Ads | Websites | Landing Pages
     tags:     [Local SEO, Google Maps]
     author:   Name of the engineer who wrote it
     cover:    /blog/my-image.jpg   (optional, file in public/blog/)
     draft:    true                 (optional — hidden on the live site)

   Files starting with "_" (like _template.md) are ignored.
   Runs only on the server, at build time.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production';
const WORDS_PER_MINUTE = 220;

export const BLOG_CATEGORIES = ['SEO', 'Social Media', 'Google Ads', 'Websites', 'Landing Pages'];

/* "Core Web Vitals" → "core-web-vitals" */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* Markdown → HTML. Headings get ids so they can be linked to,
   and links to other sites open in a new tab. */
function createRenderer() {
  const used = new Map();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugify(text) || `section-${depth}`;
        const n = used.get(id) || 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.includes('hibrands.in');
        const t = title ? ` title="${title}"` : '';
        const ext = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${href}"${t}${ext}>${text}</a>`;
      },
      image({ href, title, text }) {
        const t = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${text || ''}"${t} loading="lazy" decoding="async" />`;
      },
    },
  });
  return marked;
}

function readingMinutes(markdown) {
  const words = markdown.replace(/[#>*_`[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function toISODate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || '').slice(0, 10);
}

function readPostFile(file) {
  const slug = file.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data, content } = matter(raw);

  for (const field of ['title', 'excerpt', 'date']) {
    if (!data[field]) throw new Error(`content/blog/${file} is missing "${field}" in its front matter.`);
  }

  return {
    slug,
    title:    data.title,
    excerpt:  data.excerpt,
    date:     toISODate(data.date),
    updated:  data.updated ? toISODate(data.updated) : null,
    category: data.category || 'General',
    tags:     Array.isArray(data.tags) ? data.tags : [],
    author:   data.author || 'HiBrands team',
    cover:    data.cover || null,
    draft:    Boolean(data.draft),
    minutes:  readingMinutes(content),
    content,
  };
}

let cache = null;

/* All posts, newest first. Drafts are only included during `npm run dev`. */
export function getAllPosts() {
  if (cache && !SHOW_DRAFTS) return cache;
  if (!fs.existsSync(POSTS_DIR)) return [];
  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map(readPostFile)
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

/* Listing data only — no body, keeps client bundles small. */
export function getPostSummaries() {
  return getAllPosts().map(({ content, ...rest }) => rest);
}

export function getPost(slug) {
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return null;
  const html = createRenderer().parse(post.content);
  return { ...post, html };
}

/* Same category first, then shared tags, then newest. */
export function getRelatedPosts(slug, limit = 3) {
  const all = getPostSummaries();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: (p.category === current.category ? 3 : 0) + p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map(({ p }) => p);
}

export { formatDate } from './format.js';
