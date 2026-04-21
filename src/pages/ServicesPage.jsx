import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services, packages, faqs } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';
import {
  RiCheckDoubleLine, RiSearchLine, RiBarChartLine, RiCodeSSlashLine, RiLayoutLine,
  RiMegaphoneLine, RiRocketLine, RiBroadcastLine, RiLineChartLine, RiTrophyLine,
  RiGlobalLine, RiLightbulbLine, RiPieChartLine,
} from 'react-icons/ri';
import { FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';
import './Home.css';
import './ServiceDetail.css';

const C = '#6366F1';
const SERVICES_TILES = Array.from({ length: 90 }, (_, i) => ([
  { name: 'SEO',         Icon: RiSearchLine,     color: C },
  { name: 'Analytics',   Icon: RiBarChartLine,   color: C },
  { name: 'Web Dev',     Icon: RiCodeSSlashLine, color: C },
  { name: 'Design',      Icon: RiLayoutLine,     color: C },
  { name: 'Marketing',   Icon: RiMegaphoneLine,  color: C },
  { name: 'Growth',      Icon: RiRocketLine,     color: C },
  { name: 'Social',      Icon: RiBroadcastLine,  color: C },
  { name: 'Performance', Icon: RiLineChartLine,  color: C },
  { name: 'Results',     Icon: RiTrophyLine,     color: C },
  { name: 'Targeting',   Icon: FiTarget,         color: C },
  { name: 'Global',      Icon: RiGlobalLine,     color: C },
  { name: 'Strategy',    Icon: RiLightbulbLine,  color: C },
  { name: 'Insights',    Icon: RiPieChartLine,   color: C },
  { name: 'Trends',      Icon: FiTrendingUp,     color: C },
  { name: 'Speed',       Icon: FiZap,            color: C },
])[i % 15]);

export default function ServicesPage() {
  // Use same reveal logic as Home
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="services-page-dark">
      {/* ── PAGE HERO ── */}
      <section className="nh-hero sd-hero">
        <div className="nh-hero__brands" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {SERVICES_TILES.map((brand, i) => (
            <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': brand.color }}>
              <brand.Icon className="nh-hero__brand-icon" />
              <span className="nh-hero__brand-label">{brand.name}</span>
            </div>
          ))}
        </div>
        <div className="nh-hero__overlay" />

        <div className="container sd-hero__inner">
          <div className="nh-hero__center">
            <span className="sec-eyebrow sec-eyebrow--light nh-reveal">What We Offer</span>
            <h1 className="nh-hero__heading nh-reveal nh-delay-1">
              DIGITAL MARKETING<br />
              <span className="nh-hero__red">BUILT TO PERFORM.</span>
            </h1>
            <div className="nh-hero__underline nh-reveal nh-delay-2" />
            <p className="sd-hero__why nh-reveal nh-delay-3">
              From stunning websites to Google page-1 rankings and high-ROI ad campaigns —
              every service we offer is designed to grow your business online, measurably.
            </p>
          </div>
        </div>

        <div className="nh-hero__stats-bar nh-reveal nh-delay-4">
          {[
            { val: '5+',   lbl: 'Core Services'      },
            { val: '150+', lbl: 'Projects Delivered'  },
            { val: '3.5x', lbl: 'Average ROI'         },
            { val: '95%',  lbl: 'Client Retention'    },
          ].map((s) => (
            <div key={s.lbl} className="nh-hero__stat-item">
              <span className="nh-hero__stat-val">{s.val}</span>
              <span className="nh-hero__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALL SERVICES (Dark Grid) ── */}
      <section className="sec-services">
        <div className="sec-services__glow-1" />
        <div className="container sec-services__inner">
          <div className="sec-services__header nh-reveal">
            <span className="sec-eyebrow sec-eyebrow--light">Core Capabilities</span>
            <h2 className="sec-heading--light">
              ALL OUR <span className="sec-red-light">SOLUTIONS.</span>
            </h2>
            <div className="sec-rule--red" />
          </div>

          <div className="sec-services__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {services.map((s, i) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="sec-svc-card nh-reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                <div className="sec-svc-card__top">
                  <span className="sec-svc-card__icon" style={{ fontSize: '1.4rem' }}>
                    {s.icon}
                  </span>
                  <span className="sec-svc-card__tag" style={{ borderColor: s.color, color: s.color, background: 'rgba(255,255,255,0.05)' }}>
                    {s.label}
                  </span>
                </div>
                <h3 className="sec-svc-card__title" style={{ marginTop: '0.8rem', fontSize: '1.3rem' }}>{s.title}</h3>
                <p className="sec-svc-card__desc">{s.summary}</p>
                <div className="sd-features-mini" style={{ marginBottom: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {s.features.slice(0, 3).map((f) => (
                      <span key={f} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <RiCheckDoubleLine style={{ color: s.color }}/> {f}
                      </span>
                    ))}
                </div>
                <span className="sec-svc-card__arrow" style={{ color: s.color }}>Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION (Using ServiceDetail classes) ── */}
      <section className="sec-pricing-sd">
        <div className="container">
          <div className="sec-services__header nh-reveal" style={{ marginBottom: '3rem' }}>
            <span className="sec-eyebrow sec-eyebrow--dark">Pricing Plans</span>
            <h2 className="sec-heading--dark">
              SIMPLE, TRANSPARENT <span className="sec-red-dark">PLANS.</span>
            </h2>
            <div className="sec-rule--red" />
            <p className="sec-body--dark" style={{ maxWidth: 600, textAlign: 'center' }}>
              No hidden fees, no lock-in contracts. Choose the plan that fits your goals
              and scale up as your business grows.
            </p>
          </div>

          <div className="sd-pricing-grid">
            {packages.map((pkg, i) => (
              <div key={pkg.id} className={`sd-pricing-card nh-reveal ${pkg.popular ? 'sd-pricing-card--popular' : ''}`} style={{ transitionDelay: `${i * 0.15}s` }}>
                {pkg.popular && <div className="sd-pricing-badge">Most Popular</div>}
                <div className="sd-pricing-top">
                  <h3 className="sd-pricing-name">{pkg.name}</h3>
                  <div className="sd-pricing-price">
                    <span className="sd-price-val">{pkg.price}</span>
                    <span className="sd-price-period">{pkg.period}</span>
                  </div>
                  <p className="sd-pricing-tagline">{pkg.tagline}</p>
                </div>
                
                <ul className="sd-pricing-features">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="sd-pricing-feature">
                      <RiCheckDoubleLine className="sd-feature-icon" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="sd-pricing-bottom">
                  <Link to="/contact" className={`sec-btn ${pkg.popular ? 'sec-btn--red' : 'sec-btn--outline-dark'}`}>
                    {pkg.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION (Dark/Premium Update) ── */}
      <section className="sec-about" style={{ background: '#F8F7F5', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="sec-services__header nh-reveal" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="sec-eyebrow sec-eyebrow--dark">FAQ</span>
            <h2 className="sec-heading--dark">
              FREQUENTLY <span className="sec-red-dark">ASKED.</span>
            </h2>
            <div className="sec-rule--red" />
          </div>
          
          <div className="sp-faq-list nh-reveal nh-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      <CTA
        color="#6366F1"
        quote='"Six services. One mission. Zero excuses — your growth starts the moment you say yes."'
        sub="Stop wondering which service you need. Let's audit your brand for free and build the exact plan that moves you forward."
      />
    </main>
  );
}

/* ── Custom FAQ Accordion for Premium Look ── */
function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div 
      style={{
        background: open ? '#ffffff' : 'transparent',
        border: '1px solid',
        borderColor: open ? 'rgba(124,58,237,0.3)' : 'rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: open ? '0 10px 30px rgba(0,0,0,0.04)' : 'none'
      }}
    >
      <button 
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display-cond)',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#0D1B2A',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}
      >
        <span>{faq.question}</span>
        <svg
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease',
            color: '#6366F1'
          }}
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div 
        style={{
          maxHeight: open ? '500px' : '0',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0,0,0.2,1)',
          background: '#ffffff'
        }}
      >
        <p style={{ padding: '0 1.5rem 1.5rem', color: '#4A5568', lineHeight: 1.7 }}>
          {faq.answer}
        </p>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        /* ── Hero overlay: edge vignette, not center blob ── */
        .services-page-dark .nh-hero__overlay {
          background: linear-gradient(180deg,
            rgba(6,12,21,0.82) 0%,
            rgba(6,12,21,0.18) 20%,
            rgba(6,12,21,0.10) 50%,
            rgba(6,12,21,0.18) 80%,
            rgba(6,12,21,0.72) 100%
          ) !important;
        }
        .services-page-dark .nh-hero__heading {
          text-shadow: 0 2px 32px rgba(6,12,21,0.85), 0 0 8px rgba(6,12,21,0.6) !important;
        }
        /* ── Page Specific Theme: Indigo/Violet ── */
        .services-page-dark .sec-services__glow-1 { background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%) !important; }
        .services-page-dark .nh-hero__red,
        .services-page-dark .sec-red-light,
        .services-page-dark .sec-red-dark { color: #6366F1 !important; }
        .services-page-dark .sd-pricing-name,
        .services-page-dark .sd-price-val { color: #6366F1 !important; }
        .services-page-dark .sd-feature-icon { color: #6366F1 !important; }
        .services-page-dark .sec-rule--red { background: #6366F1 !important; }
        .services-page-dark .sec-btn--red { background: #6366F1 !important; border-color: #6366F1 !important; }
        .services-page-dark .sec-btn--red:hover { background: #4F46E5 !important; border-color: #4F46E5 !important; }
        .services-page-dark .sd-pricing-badge { background: #6366F1 !important; }
        .services-page-dark .sd-pricing-card--popular { border-color: #6366F1 !important; box-shadow: 0 0 30px rgba(99,102,241,0.2) !important; }
        .services-page-dark .nh-hero__underline { background: #6366F1 !important; }
        .services-page-dark .nh-hero__stat-val { color: #6366F1 !important; text-shadow: 0 0 24px rgba(99,102,241,0.45) !important; }
      `}} />
    </div>
  );
}
