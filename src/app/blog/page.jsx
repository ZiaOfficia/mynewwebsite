import BlogIndex from '@/views/BlogIndex.jsx';
import CTA from '@/sections/CTA/CTA.jsx';
import { NotesVisual } from '@/components/HeroVisuals.jsx';
import { getPostSummaries, BLOG_CATEGORIES } from '@/lib/blog.js';
import { formatDate } from '@/lib/format.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/blog' });

export default function Page() {
  const posts = getPostSummaries().map((p) => ({ ...p, dateLabel: formatDate(p.date) }));
  const used = new Set(posts.map((p) => p.category));
  const categories = [...BLOG_CATEGORIES.filter((c) => used.has(c)), ...[...used].filter((c) => !BLOG_CATEGORIES.includes(c))];

  return (
    <main className="blog-page">
      <JsonLd pathname="/blog" />
      <header className="phead">
        <div className="container phead__grid">
          <div>
          <h1 className="phead__title">Notes from the engineers.</h1>
          <p className="lede phead__lede">
            Practical guides on websites, SEO, social media and Google Ads, written by the
            people who do this work every day. No fluff, no jargon.
          </p>
          <p className="blog-rss">
            <a href="/blog/rss.xml" className="link">Follow by RSS</a>
          </p>
          </div>
          <NotesVisual posts={posts.filter((p) => !p.draft)} />
        </div>
      </header>

      <BlogIndex posts={posts} categories={categories} />

      <CTA sub="Have a question a post didn't answer? Ask the engineer who wrote it. The first call is free." />
    </main>
  );
}
