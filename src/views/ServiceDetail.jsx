'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ServiceVisual } from '../components/HeroVisuals.jsx';
import { serviceDetails, services } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';
import { useBooking } from '../components/BookingModal/BookingContext.jsx';

/* A plain-language closing line for each service */
const CTA_SUB = {
  'web-development': 'Tell us what your website needs to do. We will tell you how long it takes and what it costs, before anything starts.',
  'landing-pages':   'Running ads to your homepage? Tell us the offer and we will tell you what a focused page would look like.',
  'seo':             'Send us your website and we will tell you, in plain words, what is holding it back on Google.',
  'smo':             'Tell us who your customers are and we will suggest what to post, where, and how often.',
  'google-ads':      'Share what you are spending today. We will tell you honestly where it is working and where it is not.',
};

export default function ServiceDetail({ slug }) {
  const { openBooking } = useBooking();
  const service = serviceDetails[slug];
  const meta    = services.find((s) => s.slug === slug);

  /* Arriving with /services/:slug#pricing → scroll to pricing once the
     page transition (300ms exit + scroll reset) has finished */
  useEffect(() => {
    if (window.location.hash !== '#pricing') return;
    const id = setTimeout(() => {
      const el = document.getElementById('pricing');
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }, 550);
    return () => clearTimeout(id);
  }, [slug]);

  if (!service) return null;

  const descParagraphs = (meta?.description || '').trim().split(/\n\n+/).filter(Boolean).map((p) => p.replace(/\s+/g, ' ').trim());

  const scrollToPricing = (e) => {
    e.preventDefault();
    const el = document.getElementById('pricing');
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="service-detail-page">
      {/* ── Header ── */}
      <header className="phead">
        <div className="container phead__grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/#services">Services</Link>
              <span aria-hidden="true">/</span>
              <span>{meta?.label || service.title}</span>
            </nav>
            <h1 className="phead__title">{meta?.tagline || service.title}</h1>
            <p className="lede phead__lede">{meta?.summary}</p>
            <div className="phead__ctas">
              <button type="button" className="btn btn--primary" onClick={openBooking}>Book a free call</button>
              <a href="#pricing" className="btn btn--line" onClick={scrollToPricing}>See pricing</a>
            </div>
          </div>

          <ServiceVisual slug={slug} />
        </div>
      </header>

      {/* ── About the service ── */}
      <section className="section band-white">
        <div className="container split">
          <h2 className="t-1">How we approach it</h2>
          <div className="split__body">
            {descParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            <div className="included">
              <h3 className="included__title">What's included</h3>
              <ul className="ticks included__list">
                {(meta?.features || []).map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="section">
        <div className="container split">
          <h2 className="t-1">Why it matters</h2>
          <div className="split__body">
            <p>{service.whyNecessary}</p>
          </div>
        </div>
      </section>

      {/* ── Example ── */}
      <section className="section band-white">
        <div className="container">
          <div className="example">
            <div>
              <h2 className="example__title">An example from our work</h2>
              <p className="example__body">{service.howItHelped}</p>
            </div>
            <div className="example__result">
              <p className="example__result-label">The result</p>
              <p>{service.revenue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="sec-head">
            <h2 className="t-1">Pricing</h2>
            <p>Fixed prices, agreed before we start. Move up a level whenever you're ready.</p>
          </div>

          <div className="prices">
            {service.packages.map((pkg) => (
              <article key={pkg.name} className={`price ${pkg.popular ? 'price--pop' : ''}`}>
                {pkg.popular && <span className="price__badge">Most popular</span>}
                <div>
                  <h3 className="price__name">{pkg.name}</h3>
                  <p className="price__tagline">{pkg.tagline}</p>
                </div>
                <div className="price__amount">
                  <span className="price__val">{pkg.price}</span>
                  {pkg.period && pkg.price !== 'Custom' && <span className="price__period">{pkg.period}</span>}
                  {pkg.oldPrice && <span className="price__old">was {pkg.oldPrice}</span>}
                </div>
                <ul className="ticks">
                  {pkg.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <button
                  type="button"
                  onClick={openBooking}
                  className={`btn ${pkg.popular ? 'btn--primary' : 'btn--line'}`}
                >
                  {pkg.price === 'Custom' ? 'Ask for a quote' : `Choose ${pkg.name}`}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA sub={CTA_SUB[slug]} />
    </main>
  );
}
