import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './EnquirePanel.css';

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
  const [form, setForm]       = useState({
    name: '', email: '', phone: '',
    service: '', budget: '', timeline: '', message: '',
  });
  const { pathname } = useLocation();

  /* Lock body scroll when panel is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSubmitted(false), 600);
  };

  return (
    <>
      {/* ── Trigger Tab ── */}
      <button
        className="eq-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open enquiry form"
      >
        <span className="eq-trigger__text">ENQUIRE NOW</span>
      </button>

      {/* ── Backdrop ── */}
      <div
        className={`eq-backdrop${open ? ' eq-backdrop--open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <aside className={`eq-panel${open ? ' eq-panel--open' : ''}`} role="dialog" aria-modal="true" aria-label="Enquiry Form">

        {/* Close */}
        <button className="eq-close" onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="eq-panel__inner">

          {/* ── Left Branding Column ── */}
          <div className="eq-brand">
            {/* Big M */}
            <div className="eq-brand__m-wrap">
              <span className="eq-brand__m">M</span>
              <div className="eq-brand__m-glow" />
            </div>

            <div className="eq-brand__logo">
              <div className="eq-brand__logo-mark">M</div>
              <div className="eq-brand__logo-text">
                <span className="eq-brand__name">MAJ Digital</span>
                <span className="eq-brand__tagline">results that speak</span>
              </div>
            </div>

            <p className="eq-brand__pitch">
              Tell us about your goals and we'll build a free custom strategy — no lock-ins, no fluff, just a clear path to growth.
            </p>

            <ul className="eq-brand__perks">
              {[
                'Free brand audit included',
                'Response within 24 hours',
                'No commitment required',
                'Dedicated account manager',
              ].map((p) => (
                <li key={p} className="eq-brand__perk">
                  <span className="eq-brand__perk-icon">✓</span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="eq-brand__contacts">
              <a href="mailto:ss4526312@gmail.com" className="eq-contact-chip">
                <span>✉</span>
                <span>ss4526312@gmail.com</span>
              </a>
              <a href="tel:+910000000000" className="eq-contact-chip">
                <span>📞</span>
                <span>+91 00000 00000</span>
              </a>
            </div>

            {/* Decorative dots */}
            <div className="eq-brand__dots" aria-hidden="true" />
          </div>

          {/* ── Right Form Column ── */}
          <div className="eq-form-wrap">
            {submitted ? (
              <div className="eq-success">
                <div className="eq-success__icon">✓</div>
                <h3 className="eq-success__title">Enquiry Received!</h3>
                <p className="eq-success__msg">
                  Thank you, <strong>{form.name || 'there'}</strong>! Our team will reach out within 24 hours with a custom strategy for your brand.
                </p>
                <button className="eq-btn eq-btn--primary" onClick={handleClose}>
                  Back to Website
                </button>
              </div>
            ) : (
              <>
                <div className="eq-form-wrap__header">
                  <span className="eq-label">You're One Click Away</span>
                  <h2 className="eq-form-wrap__title">Let's Build Something<br /><span className="eq-red">Great Together.</span></h2>
                </div>

                <form className="eq-form" onSubmit={handleSubmit} noValidate>
                  <div className="eq-form__row">
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-name">Full Name <span className="eq-req">*</span></label>
                      <input
                        id="eq-name" name="name" type="text"
                        className="eq-field__input" placeholder="Your full name"
                        value={form.name} onChange={handleChange} required
                      />
                    </div>
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-email">Email Address <span className="eq-req">*</span></label>
                      <input
                        id="eq-email" name="email" type="email"
                        className="eq-field__input" placeholder="you@example.com"
                        value={form.email} onChange={handleChange} required
                      />
                    </div>
                  </div>

                  <div className="eq-form__row">
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-phone">Phone Number <span className="eq-req">*</span></label>
                      <input
                        id="eq-phone" name="phone" type="tel"
                        className="eq-field__input" placeholder="+91 00000 00000"
                        value={form.phone} onChange={handleChange} required
                      />
                    </div>
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-service">Service Interested In</label>
                      <select id="eq-service" name="service" className="eq-field__input eq-field__select" value={form.service} onChange={handleChange}>
                        <option value="">Select a service…</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="eq-form__row">
                    <div className="eq-field">
                      <label className="eq-field__label" htmlFor="eq-budget">Budget Range</label>
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
                    <label className="eq-field__label" htmlFor="eq-message">Tell Us About Your Project</label>
                    <textarea
                      id="eq-message" name="message"
                      className="eq-field__input eq-field__textarea"
                      placeholder="Describe your goals, challenges, or anything you'd like us to know…"
                      rows={4}
                      value={form.message} onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="eq-btn eq-btn--primary eq-btn--submit">
                    Send My Enquiry
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <p className="eq-form__note">By submitting you agree to be contacted by MAJ Digital. No spam, ever.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
