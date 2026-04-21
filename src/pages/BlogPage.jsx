import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts, blogCategories } from '../data/index.js';
import {
  RiEditLine, RiSearchLine, RiLightbulbLine, RiBroadcastLine, RiMegaphoneLine,
  RiLineChartLine, RiBarChartLine, RiGlobalLine, RiRocketLine, RiCheckDoubleLine,
  RiBookOpenLine, RiDraftLine, RiNewspaperLine, RiFileTextLine, RiPieChartLine,
} from 'react-icons/ri';
import { FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import './Home.css';
import './ServiceDetail.css';

const T = '#0EA5E9';
const BLOG_TILES = Array.from({ length: 90 }, (_, i) => ([
  { name: 'Articles',    Icon: RiEditLine,        color: T },
  { name: 'Research',    Icon: RiSearchLine,      color: T },
  { name: 'Insights',    Icon: RiLightbulbLine,   color: T },
  { name: 'Social',      Icon: RiBroadcastLine,   color: T },
  { name: 'Content',     Icon: RiMegaphoneLine,   color: T },
  { name: 'Trends',      Icon: FiTrendingUp,      color: T },
  { name: 'Analytics',   Icon: FiBarChart2,       color: T },
  { name: 'SEO',         Icon: RiLineChartLine,   color: T },
  { name: 'Guides',      Icon: RiCheckDoubleLine, color: T },
  { name: 'Digital',     Icon: RiGlobalLine,      color: T },
  { name: 'Tips',        Icon: RiRocketLine,      color: T },
  { name: 'Read',        Icon: RiBookOpenLine,    color: T },
  { name: 'Write',       Icon: RiDraftLine,       color: T },
  { name: 'Strategy',    Icon: RiPieChartLine,    color: T },
  { name: 'Stats',       Icon: RiBarChartLine,    color: T },
])[i % 15]);

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory]);

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <main className="blog-page-dark">

      {/* ── Page Hero ── */}
      <section className="nh-hero sd-hero">
        <div className="nh-hero__brands" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {BLOG_TILES.map((item, i) => (
            <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': item.color }}>
              <item.Icon className="nh-hero__brand-icon" />
              <span className="nh-hero__brand-label">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="nh-hero__overlay" />

        <div className="container sd-hero__inner">
          <div className="nh-hero__center">
            <span className="sec-eyebrow sec-eyebrow--light nh-reveal">The Blog</span>
            <h1 className="nh-hero__heading nh-reveal nh-delay-1" style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}>
              INSIGHTS & <span className="nh-hero__red">TIPS.</span>
            </h1>
            <div className="nh-hero__underline nh-reveal nh-delay-2" />
            <p className="sd-hero__why nh-reveal nh-delay-3" style={{ fontSize: '1.25rem' }}>
              Strategies, tutorials, and industry news to help you grow faster.
            </p>
          </div>
        </div>

        <div className="nh-hero__stats-bar nh-reveal nh-delay-4">
          {[
            { val: '50+',    lbl: 'Articles Published' },
            { val: '10K+',   lbl: 'Monthly Readers'    },
            { val: '6',      lbl: 'Topic Categories'   },
            { val: 'Weekly', lbl: 'New Content'         },
          ].map((s) => (
            <div key={s.lbl} className="nh-hero__stat-item">
              <span className="nh-hero__stat-val">{s.val}</span>
              <span className="nh-hero__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Posts Section (Light Theme) ── */}
      <section className="sec-about" style={{ padding: '6rem 0', background: '#F8F7F5' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }} className="blog-wrapper">

            {/* ── Main content ── */}
            <div className="nh-reveal-left">
              {/* Category filter */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '99px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '2px solid',
                      borderColor: activeCategory === cat ? '#0EA5E9' : 'rgba(13, 27, 42, 0.15)',
                      background: activeCategory === cat ? '#0EA5E9' : 'transparent',
                      color: activeCategory === cat ? '#ffffff' : '#0D1B2A',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-display-cond)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Posts list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filtered.length === 0 ? (
                  <p style={{ color: '#6B7280', fontSize: '1rem' }}>No posts in this category yet.</p>
                ) : (
                  filtered.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="sd-blog-card">
                      <div className="sd-blog-card__img">
                        <span style={{ fontSize: '4rem', opacity: 0.8 }}>📝</span>
                      </div>
                      <div className="sd-blog-card__body">
                        <div className="sd-blog-card__meta">
                           <span style={{ color: '#0EA5E9' }}>{post.category}</span>
                           <span>·</span>
                           <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                           <span>·</span>
                           <span>{post.readTime}</span>
                        </div>
                        <h2 className="sd-blog-card__title">{post.title}</h2>
                        <p className="sd-blog-card__excerpt">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="nh-reveal nh-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: 'calc(var(--header-h) + 2rem)' }}>
              
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #EBEBEB' }}>
                <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '1.2rem', color: '#0D1B2A', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '2px solid #0EA5E9', paddingBottom: '0.5rem' }}>
                  Search
                </h3>
                <input
                  type="search"
                  placeholder="Search articles..."
                  style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #EBEBEB', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #EBEBEB' }}>
                <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '1.2rem', color: '#0D1B2A', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '2px solid #0EA5E9', paddingBottom: '0.5rem' }}>
                  Recent Posts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blogPosts.slice(0, 4).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} style={{ fontSize: '0.95rem', color: '#0D1B2A', fontWeight: 600, textDecoration: 'none', lineHeight: 1.4 }}>
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0D1B2A', borderRadius: '16px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(13, 27, 42, 0.15)' }}>
                <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '1.4rem', color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Get a <span style={{ color: '#0EA5E9' }}>Free Audit</span>
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Let us analyse your current digital presence for free.
                </p>
                <Link to="/contact" className="sec-btn sec-btn--red" style={{ width: '100%', justifyContent: 'center' }}>
                  Start Now →
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .blog-wrapper { grid-template-columns: 1fr !important; }
          .blog-wrapper aside { position: static !important; }
        }
        /* ── Hero overlay: edge vignette, not center blob ── */
        .blog-page-dark .nh-hero__overlay {
          background: linear-gradient(180deg,
            rgba(6,12,21,0.82) 0%,
            rgba(6,12,21,0.18) 20%,
            rgba(6,12,21,0.10) 50%,
            rgba(6,12,21,0.18) 80%,
            rgba(6,12,21,0.72) 100%
          ) !important;
        }
        .blog-page-dark .nh-hero__heading {
          text-shadow: 0 2px 32px rgba(6,12,21,0.85), 0 0 8px rgba(6,12,21,0.6) !important;
        }
        /* ── Page Specific Theme: Electric Sky ── */
        .blog-page-dark .nh-hero__red { color: #0EA5E9 !important; }
        .blog-page-dark .sec-red-light,
        .blog-page-dark .sec-red-dark { color: #0EA5E9 !important; }
        .blog-page-dark .sec-rule--red { background: #0EA5E9 !important; }
        .blog-page-dark .nh-hero__underline { background: #0EA5E9 !important; }
        .blog-page-dark .nh-hero__stat-val { color: #0EA5E9 !important; text-shadow: 0 0 24px rgba(14,165,233,0.45) !important; }
        .blog-page-dark .sec-btn--red { background: #0EA5E9 !important; border-color: #0EA5E9 !important; }
        .blog-page-dark .sec-btn--red:hover { background: #0284C7 !important; border-color: #0284C7 !important; }
        .blog-page-dark .sd-pricing-badge { background: #0EA5E9 !important; }
        .blog-page-dark .sd-pricing-name,
        .blog-page-dark .sd-price-val { color: #0EA5E9 !important; }
        .blog-page-dark .sd-feature-icon { color: #0EA5E9 !important; }
        .blog-page-dark .sd-pricing-card--popular { border-color: #0EA5E9 !important; box-shadow: 0 0 30px rgba(14,165,233,0.2) !important; }
      `}} />
    </main>
  );
}
