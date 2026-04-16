import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Page.css';
import { blogPosts, blogCategories } from '../data/index.js';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <main className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="page-hero section--navy">
        <div className="page-hero__pattern" />
        <div className="container page-hero__inner">
          <p className="section-label">The Blog</p>
          <h1 className="display-lg page-hero__title">
            Digital marketing<br />insights & tips
          </h1>
          <p className="body-lg page-hero__sub">
            Strategies, tutorials, and industry news to help you grow faster.
          </p>
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="section section--white">
        <div className="container">
          <div className="blog-page-grid">

            {/* ── Main content ── */}
            <div>
              {/* Category filter */}
              <div className="blog-page-cats">
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`blog-cat-btn ${activeCategory === cat ? 'blog-cat-btn--active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Posts list */}
              <div className="blog-page-posts">
                {filtered.length === 0 ? (
                  <p className="body-md" style={{ color: 'var(--gray-500)' }}>
                    No posts in this category yet.
                  </p>
                ) : (
                  filtered.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="blog-list-card">
                      <div className="blog-list-card__img">📝</div>
                      <div className="blog-list-card__body">
                        <div className="blog-list-card__meta">
                          <span className="tag tag-gold">{post.category}</span>
                          <span>·</span>
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>
                            {new Date(post.date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="blog-list-card__title">{post.title}</h2>
                        <p className="blog-list-card__excerpt">{post.excerpt}</p>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                          {post.tags.map((tag) => (
                            <span key={tag} className="tag tag-navy">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="blog-sidebar">
              {/* Search */}
              <div className="blog-sidebar__widget">
                <h3 className="blog-sidebar__title">Search</h3>
                <input
                  type="search"
                  placeholder="Search articles..."
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Categories */}
              <div className="blog-sidebar__widget">
                <h3 className="blog-sidebar__title">Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {blogCategories.filter((c) => c !== 'All').map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        textAlign: 'left',
                        padding: '0.4rem 0',
                        fontSize: '0.875rem',
                        color: activeCategory === cat ? 'var(--gold)' : 'var(--gray-700)',
                        fontWeight: activeCategory === cat ? 700 : 400,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        borderBottom: '1px solid var(--gray-200)',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent posts */}
              <div className="blog-sidebar__widget">
                <h3 className="blog-sidebar__title">Recent Posts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {blogPosts.slice(0, 4).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}
                      style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', lineHeight: 1.3 }}
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA box */}
              <div className="blog-sidebar__cta-box">
                <h3>Get a Free Audit</h3>
                <p>Let us analyse your current digital presence for free.</p>
                <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Start Now
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
