import { useParams, Link, Navigate } from 'react-router-dom';
import './Page.css';
import { blogPosts } from '../data/index.js';

/* Very simple markdown-like renderer */
function SimpleMarkdown({ content }) {
  const lines = content.trim().split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { elements.push(<br key={key++} />); continue; }
    if (line.startsWith('## '))  { elements.push(<h2 key={key++}>{line.slice(3)}</h2>); continue; }
    if (line.startsWith('### ')) { elements.push(<h3 key={key++}>{line.slice(4)}</h3>); continue; }
    if (line.startsWith('- '))   { elements.push(<li key={key++}>{line.slice(2)}</li>); continue; }
    elements.push(<p key={key++}>{line}</p>);
  }

  return <>{elements}</>;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <main className="page-wrapper">

      {/* ── Post Hero ── */}
      <section className="page-hero section--navy">
        <div className="page-hero__pattern" />
        <div className="container">
          <div className="post-header">
            <div className="post-header__meta">
              <Link to="/blog" className="btn-ghost btn-ghost-light" style={{ fontSize: '0.8rem' }}>
                ← Blog
              </Link>
              <span className="tag tag-gold">{post.category}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{post.readTime}</span>
            </div>
            <h1 className="post-header__title">{post.title}</h1>
            <div className="post-header__author">
              <div className="post-header__avatar">{post.author.charAt(0)}</div>
              <div>
                <p className="post-header__author-name">{post.author}</p>
                <p className="post-header__author-date">
                  {new Date(post.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Post Body ── */}
      <section className="section section--white">
        <div className="container">
          <div className="post-layout">

            {/* ── Main Article ── */}
            <article>
              {/* Hero Image placeholder */}
              <div className="post-hero-img">📝</div>

              {/* Content */}
              <div className="post-content">
                <SimpleMarkdown content={post.content} />
              </div>

              {/* Tags */}
              <div className="post-tags">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginRight: '0.5rem' }}>
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span key={tag} className="tag tag-navy">{tag}</span>
                ))}
              </div>

              {/* Author box */}
              <div style={{
                marginTop: 'var(--space-xl)',
                padding: 'var(--space-lg)',
                background: 'var(--off-white)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                border: '1px solid var(--gray-200)',
              }}>
                <div className="post-header__avatar" style={{ width: 56, height: 56, fontSize: '1.4rem', flexShrink: 0 }}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>
                    {post.author}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                    Placeholder author role / title
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                    Placeholder author bio — 1–2 sentences about the author.
                  </p>
                </div>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="blog-sidebar">
              <div className="blog-sidebar__cta-box">
                <h3>Get a Free Audit</h3>
                <p>See how your digital presence can improve — at no cost.</p>
                <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Start Now
                </Link>
              </div>

              {relatedPosts.length > 0 && (
                <div className="blog-sidebar__widget">
                  <h3 className="blog-sidebar__title">Related Articles</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {relatedPosts.map((p) => (
                      <Link key={p.id} to={`/blog/${p.slug}`}
                        style={{ fontSize: '0.875rem', color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', lineHeight: 1.4 }}
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="blog-sidebar__widget">
                <h3 className="blog-sidebar__title">Newsletter</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', margin: '0.5rem 0' }}>
                  Get weekly marketing tips in your inbox.
                </p>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input type="email" placeholder="Your email" className="form-input" />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
