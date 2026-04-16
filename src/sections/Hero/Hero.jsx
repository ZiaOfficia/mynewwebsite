import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import { agency, heroCycleWords } from '../../data/index.js';

export default function Hero() {
  const [wordIdx, setWordIdx]   = useState(0);
  const [visible, setVisible]   = useState(true);

  // Cycle through words with fade in/out
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
      {/* ── Background layers ── */}
      <div className="hero__bg" />
      <div className="hero__dots" />
      <div className="hero__lines" />
      <div className="hero__glow" />

      {/* ── Content ── */}
      <div className="container hero__content">
        <div className="hero__text-block">
          {/* Eyebrow */}
          <p className="hero__eyebrow anim-fade-up">
            <span className="hero__eyebrow-dot" />
            Welcome to {agency.name}
          </p>

          {/* Main heading */}
          <h1 className="hero__heading display-xl anim-fade-up delay-1">
            We grow your<br />
            <span className={`hero__cycle-word ${visible ? 'hero__cycle-word--in' : 'hero__cycle-word--out'}`}>
              {heroCycleWords[wordIdx]}
            </span>
          </h1>

          {/* Sub copy */}
          <p className="hero__sub body-lg anim-fade-up delay-2">
            {agency.description}
          </p>

          {/* CTAs */}
          <div className="hero__ctas anim-fade-up delay-3">
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

          {/* Trust bar */}
          <div className="hero__trust anim-fade-up delay-4">
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
        <div className="hero__stats-block anim-fade-up delay-3">
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
