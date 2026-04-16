import { Link } from 'react-router-dom';
import './Page.css';
import { services, packages, faqs } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';

export default function ServicesPage() {
  return (
    <main className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="page-hero section--navy">
        <div className="page-hero__pattern" />
        <div className="container page-hero__inner">
          <p className="section-label">What We Offer</p>
          <h1 className="display-lg page-hero__title">
            Digital marketing<br />built to perform
          </h1>
          <p className="body-lg page-hero__sub">
            From stunning websites to Google page-1 rankings and high-ROI ad campaigns —
            every service we offer is designed to grow your business online, measurably.
          </p>
        </div>
      </section>

      {/* ── All Services ── */}
      <section className="section section--white">
        <div className="container">
          <div className="services-page__grid">
            {services.map((s) => (
              <div key={s.id} className="services-page__card">
                <div className="services-page__card-header" style={{ '--accent': s.color }}>
                  <span className="services-page__icon">{s.icon}</span>
                  <span className="tag tag-gold">{s.label}</span>
                </div>
                <h2 className="services-page__title display-sm">{s.title}</h2>
                <p className="services-page__tagline heading-sm">{s.tagline}</p>
                <p className="services-page__desc body-md">{s.summary}</p>
                <ul className="services-page__features">
                  {s.features.map((f) => (
                    <li key={f} className="services-page__feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/services/${s.slug}`} className="btn btn-outline-dark services-page__cta">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="section section--off-white">
        <div className="container">
          <div className="pricing-header">
            <p className="section-label">Pricing</p>
            <h2 className="display-md">Simple, transparent plans</h2>
            <p className="body-lg pricing-sub">
              No hidden fees, no lock-in contracts. Choose the plan that fits your goals
              and scale up as your business grows. Every plan includes a dedicated account manager.
            </p>
          </div>
          <div className="pricing-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`pricing-card ${pkg.popular ? 'pricing-card--popular' : ''}`}>
                {pkg.popular && <span className="pricing-card__badge">Most Popular</span>}
                <p className="pricing-card__name caption">{pkg.name}</p>
                <div className="pricing-card__price">
                  <span className="pricing-card__amount">{pkg.price}</span>
                  <span className="pricing-card__period">{pkg.period}</span>
                </div>
                <p className="pricing-card__tagline">{pkg.tagline}</p>
                <ul className="pricing-card__features">
                  {pkg.features.map((f) => (
                    <li key={f} className="pricing-card__feature">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`btn ${pkg.popular ? 'btn-primary' : 'btn-outline-dark'} pricing-card__cta`}>
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section--white">
        <div className="container faq-container">
          <div className="faq-header">
            <p className="section-label">FAQ</p>
            <h2 className="display-md">Frequently asked questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}

/* ── FAQ Accordion Item ── */
import { useState } from 'react';

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-item__q" onClick={() => setOpen(!open)}>
        <span>{faq.question}</span>
        <svg
          className="faq-item__icon"
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div className="faq-item__a">
        <p className="body-md">{faq.answer}</p>
      </div>
    </div>
  );
}
