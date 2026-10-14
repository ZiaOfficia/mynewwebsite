'use client';

import { useState, useEffect } from 'react';
import BrandName from '../BrandName.jsx';
import { agency } from '../../data/index.js';
import { submitToSheet } from '../../lib/sheets.js';

const SERVICES = [
  'Web Development',
  'Landing Page Design',
  'Search Engine Optimisation (SEO)',
  'Social Media Optimisation (SMO)',
  'Google Ads Management',
  'Content Marketing',
  'Full Digital Strategy',
  'Other',
];

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Not sure yet',
];

const TIMELINES = [
  'ASAP',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  'Just exploring',
];

export default function EnquirePanel() {
  const [open, setOpen]       = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [form, setForm]       = useState({
    name: '', email: '', phone: '',
    service: '', budget: '', timeline: '', message: '',
  });

  /* Lock body scroll when panel is open (incl. Lenis smooth scroll) */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
    return () => { document.body.style.overflow = ''; window.__lenis?.start(); };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Mobile quick-contact bar: appears once the hero has scrolled away */
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      await submitToSheet({
        formType: 'enquiry',
        fullName: form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        service:  form.service,
        budget:   form.budget,
        timeline: form.timeline,
        message:  form.message.trim(),
      });
      setSubmitted(true);
    } catch {
      setSendError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setSubmitted(false); setSendError(''); }, 600);
  };

  return (
    <>
      {/* ── Trigger Tab ── */}
      <button
        className="eq-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open enquiry form"
      >
        <span className="eq-trigger__text">Enquire</span>
      </button>

      {/* ── Mobile and tablet: quick-contact bar ── */}
      <div className={`mbar ${showBar ? 'mbar--show' : ''}`} aria-hidden={!showBar}>
        <a href={`tel:${agency.phone.replace(/\s/g, '')}`} className="mbar__call" tabIndex={showBar ? 0 : -1}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
          Call us
        </a>
        <button type="button" className="mbar__go" onClick={() => setOpen(true)} tabIndex={showBar ? 0 : -1}>
          Enquire now
        </button>
      </div>

      {/* ── Backdrop ── */}
      <div
        className={`eq-backdrop${open ? ' eq-backdrop--open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <aside className={`eq-panel${open ? ' eq-panel--open' : ''}`} role="dialog" aria-modal="true" aria-label="Enquiry Form" data-lenis-prevent>

        {/* Close */}
        <button className="eq-close" onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="eq-panel__inner">

          {/* ── Left column ── */}
          <div className="eq-brand">
            <p className="eq-brand__name"><BrandName /></p>
            <p className="eq-brand__pitch">
              Tell us what you need. An engineer from the team will reply within
              24 hours with honest advice on time and price.
            </p>

            <ul className="ticks eq-brand__perks">
              {[
                'Free first consultation',
                'Reply within 24 hours',
                'No commitment required',
                'You talk to the engineer, not a middleman',
              ].map((p) => <li key={p}>{p}</li>)}
            </ul>

            <a href={`tel:${agency.phone.replace(/\s/g, '')}`} className="eq-brand__phone">
              Prefer to talk? Call {agency.phone}
            </a>
          </div>

          {/* ── Right Form Column ── */}
          <div className="eq-form-wrap">
            {submitted ? (
              <div className="eq-success">
                <div className="eq-success__icon" aria-hidden="true">✓</div>
                <h3 className="eq-success__title">Enquiry sent</h3>
                <p className="eq-success__msg">
                  Thank you, <strong>{form.name || 'there'}</strong>! We'll reply within 24 hours.
                </p>
                <button className="eq-btn eq-btn--primary" onClick={handleClose}>
                  Back to the website
                </button>
              </div>
            ) : (
              <>
                <div className="eq-form-wrap__header">
                  <h2 className="eq-form-wrap__title">Tell us about your project</h2>
                </div>

                <form className="eq-form" onSubmit={handleSubmit} noValidate>
                  <div className="eq-form__row">
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-name">Full name <span className="eq-req">*</span></label>
                      <input
                        id="eq-name" name="name" type="text"
                        className="eq-field__input" placeholder="Your full name"
                        value={form.name} onChange={handleChange} required
                      />
                    </div>
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-email">Email <span className="eq-req">*</span></label>
                      <input
                        id="eq-email" name="email" type="email"
                        className="eq-field__input" placeholder="you@example.com"
                        value={form.email} onChange={handleChange} required
                      />
                    </div>
                  </div>

                  <div className="eq-form__row">
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-phone">Phone <span className="eq-req">*</span></label>
                      <input
                        id="eq-phone" name="phone" type="tel"
                        className="eq-field__input" placeholder="+91 00000 00000"
                        value={form.phone} onChange={handleChange} required
                      />
                    </div>
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-service">Service</label>
                      <select id="eq-service" name="service" className="eq-field__input eq-field__select" value={form.service} onChange={handleChange}>
                        <option value="">Select a service…</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="eq-form__row">
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-budget">Budget</label>
                      <select id="eq-budget" name="budget" className="eq-field__input eq-field__select" value={form.budget} onChange={handleChange}>
                        <option value="">Select a budget…</option>
                        {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-timeline">Timeline</label>
                      <select id="eq-timeline" name="timeline" className="eq-field__input eq-field__select" value={form.timeline} onChange={handleChange}>
                        <option value="">When do you need this?</option>
                        {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="eq-field eq-field--full">
                    <label className="eq-field__label" htmlFor="eq-message">About your project</label>
                    <textarea
                      id="eq-message" name="message"
                      className="eq-field__input eq-field__textarea"
                      placeholder="Describe your goals, challenges, or anything you'd like us to know…"
                      rows={4}
                      value={form.message} onChange={handleChange}
                    />
                  </div>

                  {sendError && (
                    <p className="form-error">{sendError}</p>
                  )}

                  <button
                    type="submit"
                    className="eq-btn eq-btn--primary eq-btn--submit"
                    disabled={sending}
                    style={{ opacity: sending ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
                  >
                    {sending ? 'Sending…' : 'Send enquiry'}
                  </button>

                  <p className="eq-form__note">By submitting you agree to be contacted by HiBrands. No spam, ever.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
