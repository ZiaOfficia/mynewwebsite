import { ROUTE_SEO, absoluteUrl } from '@/seo/seo.config.js';
import { getPostSummaries } from '@/lib/blog.js';

export default function sitemap() {
  const pages = Object.entries(ROUTE_SEO).map(([path, seo]) => ({
    url: absoluteUrl(path),
    changeFrequency: seo.changefreq,
    priority: seo.priority,
  }));
  const posts = getPostSummaries().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updated || post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...pages, ...posts];
}
