'use client';

import { useState } from 'react';
import Link from 'next/link';

function Meta({ post }) {
  return (
    <p className="post-meta">
      <span className="post-meta__cat">{post.category}</span>
      <time dateTime={post.date}>{post.dateLabel}</time>
      <span>{post.minutes} min read</span>
      {post.draft && <span className="post-meta__draft">Draft</span>}
    </p>
  );
}

export default function BlogIndex({ posts, categories }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? posts : posts.filter((p) => p.category === filter);
  const [lead, ...rest] = visible;

  return (
    <section className="blog-list">
      <div className="container">
        {categories.length > 1 && (
          <div className="pj-filters" role="group" aria-label="Filter posts by topic">
            {['All', ...categories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                className={`pj-filter ${filter === c ? 'pj-filter--active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {!lead && (
          <div className="blog-empty">
            <h2 className="t-2">No posts here yet.</h2>
            <p className="muted">We're writing them. Pick another topic, or check back soon.</p>
          </div>
        )}

        {lead && (
          <Link href={`/blog/${lead.slug}`} className="post-lead">
            <Meta post={lead} />
            <h2 className="post-lead__title">{lead.title}</h2>
            <p className="post-lead__excerpt">{lead.excerpt}</p>
            <span className="post-lead__go">Read the post</span>
          </Link>
        )}

        {rest.length > 0 && (
          <ul className="post-rows">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="post-row">
                  <Meta post={p} />
                  <span className="post-row__text">
                    <span className="post-row__title">{p.title}</span>
                    <span className="post-row__excerpt">{p.excerpt}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
