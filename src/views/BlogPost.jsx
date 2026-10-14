import Link from 'next/link';
import Image from 'next/image';
import CTA from '@/sections/CTA/CTA.jsx';

export default function BlogPost({ post, related }) {
  return (
    <main className="post-page">
      <header className="phead post-head">
        <div className="container post-head__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true">/</span>
            <span>{post.category}</span>
          </nav>
          {post.draft && (
            <p className="post-draft-note">Draft: only visible while running the site locally.</p>
          )}
          <h1 className="post-head__title">{post.title}</h1>
          <p className="lede post-head__lede">{post.excerpt}</p>
          <div className="post-byline">
            <span className="post-byline__avatar" aria-hidden="true">{post.author.charAt(0)}</span>
            <span>
              <span className="post-byline__name">{post.author}</span>
              <span className="post-byline__meta">
                <time dateTime={post.date}>{post.dateLabel}</time>
                <span>{post.minutes} min read</span>
              </span>
            </span>
          </div>
        </div>
      </header>

      <div className="container">
        {post.cover && (
          <div className="post-cover">
            <Image src={post.cover} alt="" width={1600} height={900} sizes="(max-width: 900px) 100vw, 900px" priority />
          </div>
        )}

        <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.tags.length > 0 && (
          <ul className="post-tags" aria-label="Topics">
            {post.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>

      {related.length > 0 && (
        <section className="section post-related">
          <div className="container">
            <h2 className="t-2">Keep reading</h2>
            <div className="related-grid">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="related-card">
                  <span className="related-card__cat">{p.category}</span>
                  <span className="related-card__title">{p.title}</span>
                  <span className="related-card__meta">{p.minutes} min read</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA sub="Want this done for your business instead? Talk to the engineer who wrote it. The first call is free." />
    </main>
  );
}
