import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import { agency, heroCycleWords } from '../../data/index.js';

const BRAND_ROWS = [
  [
    { name: 'Google',      color: '#4285F4' },
    { name: 'Meta',        color: '#0082FB' },
    { name: 'Shopify',     color: '#96BF48' },
    { name: 'HubSpot',     color: '#FF7A59' },
    { name: 'Salesforce',  color: '#00A1E0' },
    { name: 'Adobe',       color: '#FF0000' },
    { name: 'Microsoft',   color: '#F25022' },
    { name: 'Stripe',      color: '#635BFF' },
    { name: 'LinkedIn',    color: '#0A66C2' },
    { name: 'TikTok',      color: '#FF0050' },
    { name: 'YouTube',     color: '#FF0000' },
    { name: 'Amazon',      color: '#FF9900' },
  ],
  [
    { name: 'Mailchimp',   color: '#FFE01B' },
    { name: 'Klaviyo',     color: '#9B59B6' },
    { name: 'Semrush',     color: '#FF642D' },
    { name: 'WooCommerce', color: '#7F54B3' },
    { name: 'Canva',       color: '#00C4CC' },
    { name: 'Netflix',     color: '#E50914' },
    { name: 'Spotify',     color: '#1DB954' },
    { name: 'Notion',      color: '#8B8B8B' },
    { name: 'Figma',       color: '#F24E1E' },
    { name: 'Webflow',     color: '#4353FF' },
    { name: 'Slack',       color: '#E01E5A' },
    { name: 'Zoom',        color: '#2D8CFF' },
  ],
  [
    { name: 'Airbnb',      color: '#FF5A5F' },
    { name: 'PayPal',      color: '#0070E0' },
    { name: 'Pinterest',   color: '#E60023' },
    { name: 'Snapchat',    color: '#FFDD00' },
    { name: 'Twitch',      color: '#9146FF' },
    { name: 'Twitter',     color: '#1DA1F2' },
    { name: 'Ahrefs',      color: '#FF6B35' },
    { name: 'Moz',         color: '#1779BA' },
    { name: 'Hotjar',      color: '#FF3C00' },
    { name: 'Typeform',    color: '#262627' },
    { name: 'Intercom',    color: '#1F8DED' },
    { name: 'ActiveCampaign', color: '#356AE6' },
  ],
];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % heroCycleWords.length);
        setVisible(true);
      }, 350);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {/* ── Background base ── */}
      <div className="hero__bg" />
      <div className="hero__glow" />
      <div className="hero__glow-2" />

      {/* ── Brand Logos Marquee Background ── */}
      <div className="hero__brands-bg" aria-hidden="true">
        {BRAND_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className={`hero__brand-row hero__brand-row--${rowIdx + 1}`}>
            <div className={`hero__brand-track${rowIdx % 2 === 1 ? ' hero__brand-track--reverse' : ''}`}>
              {[...row, ...row].map((brand, i) => (
                <div key={i} className="hero__brand-item">
                  <span className="hero__brand-dot" style={{ background: brand.color }} />
                  <span className="hero__brand-name">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="hero__brands-mask-left" />
        <div className="hero__brands-mask-right" />
      </div>

      {/* ── Content ── */}
      <div className="container hero__content">
        <div className="hero__text-block">
          <h1 className="hero__heading display-xl anim-fade-up">
            We grow your<br />
            <span className={`hero__cycle-word ${visible ? 'hero__cycle-word--in' : 'hero__cycle-word--out'}`}>
              {heroCycleWords[wordIdx]}
            </span>
          </h1>

          <p className="hero__sub body-lg anim-fade-up delay-1">
            {agency.description}
          </p>

          <div className="hero__ctas anim-fade-up delay-2">
            <Link to="/contact" className="btn btn-primary">
              Get a Free Audit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/services" className="btn btn-outline">
              Our Services
            </Link>
          </div>

          <div className="hero__trust anim-fade-up delay-3">
            <span className="hero__trust-item">
              <span className="hero__trust-icon">✓</span> No long-term lock-ins
            </span>
            <span className="hero__trust-sep" />
            <span className="hero__trust-item">
              <span className="hero__trust-icon">✓</span> Dedicated account manager
            </span>
            <span className="hero__trust-sep" />
            <span className="hero__trust-item">
              <span className="hero__trust-icon">✓</span> Monthly transparent reports
            </span>
          </div>
        </div>

        {/* ── Stats sidebar ── */}
        <div className="hero__stats-block anim-fade-up delay-2">
          <HeroStatCard value="0+" label="Brands Grown" />
          <HeroStatCard value="0%" label="Client Retention" />
          <HeroStatCard value="0x"  label="Average ROI" />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-label">Scroll</span>
      </div>
    </section>
  );
}

function HeroStatCard({ value, label }) {
  return (
    <div className="hero__stat-card">
      <span className="hero__stat-value">{value}</span>
      <span className="hero__stat-label">{label}</span>
    </div>
  );
}
