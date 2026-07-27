'use client';

import { useState } from 'react';
import {
  RiCheckboxCircleLine,
  RiCheckboxCircleFill,
  RiShieldCheckLine,
  RiArrowRightLine,
} from 'react-icons/ri';
import { submitToSheet } from '../lib/sheets';

const POINTS = [
  'Free quote within 24 hours',
  'A dedicated strategist — not a sales bot',
  'Fixed pricing, no lock-ins, no surprises',
  'Honest advice even if we\'re not the right fit',
];

export default function LeadForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', budget: '', message: '',
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await submitToSheet({
        formType: 'landing-ads',
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        budget: form.budget,
        message: form.message,
      });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section section--dark lp-lead" id="lead-form">
      <div className="container">
        <div className="lp-lead__inner">
          {/* ── Intro / trust ── */}
          <div className="nh-reveal-left">
            <span className="sec-eyebrow lp-lead__intro-eyebrow">Get Started</span>
            <h2 className="sec-heading--light" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.6rem)' }}>
              Let&apos;s Build Your<br /><span className="sec-red">Lead Machine</span>
            </h2>
            <div className="sec-rule" />
            <p className="sec-body--light">
              Tell us a little about your goals and we&apos;ll get back within 24 hours with a
              fixed quote and a clear plan — no jargon, no pressure.
            </p>

            <div className="lp-lead__points">
              {POINTS.map((p) => (
                <div key={p} className="lp-lead__point">
                  <RiCheckboxCircleLine size={20} /> {p}
                </div>
              ))}
            </div>

            <p className="lp-lead__assure">
              <RiShieldCheckLine size={18} />
              Your details are only used to prepare your quote. We never spam or share your data.
            </p>
          </div>

          {/* ── Form ── */}
          <div className="nh-reveal nh-delay-1">
            {sent ? (
              <div className="lp-form" style={{ display: 'block' }}>
                <div className="lp-form__success">
                  <div className="lp-form__success-icon"><RiCheckboxCircleFill /></div>
                  <h3>Request Received</h3>
                  <p>Thanks! One of our strategists will reach out within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form className="lp-form" onSubmit={handleSubmit}>
                <div className="lp-field">
                  <label htmlFor="lf-name">Full Name *</label>
                  <input id="lf-name" type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="lp-field">
                  <label htmlFor="lf-email">Email *</label>
                  <input id="lf-email" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="john@company.com" />
                </div>
                <div className="lp-field">
                  <label htmlFor="lf-phone">Phone</label>
                  <input id="lf-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                </div>
                <div className="lp-field">
                  <label htmlFor="lf-service">I Need A *</label>
                  <select id="lf-service" name="service" required value={form.service} onChange={handleChange}>
                    <option value="">Select a service</option>
                    <option value="landing-page">Landing Page</option>
                    <option value="website">Website</option>
                    <option value="both">Both</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
                <div className="lp-field lp-field--full">
                  <label htmlFor="lf-budget">Budget Range</label>
                  <select id="lf-budget" name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Select budget range</option>
                    <option value="under-10k">Under ₹10,000</option>
                    <option value="10k-25k">₹10,000 – ₹25,000</option>
                    <option value="25k-50k">₹25,000 – ₹50,000</option>
                    <option value="above-50k">Above ₹50,000</option>
                  </select>
                </div>
                <div className="lp-field lp-field--full">
                  <label htmlFor="lf-message">Tell Us About Your Goals</label>
                  <textarea id="lf-message" name="message" value={form.message} onChange={handleChange} placeholder="What are you promoting, and what does success look like?" />
                </div>

                {error && <p className="lp-form__error">{error}</p>}

                <div className="lp-form__submit">
                  <button type="submit" className="sec-btn sec-btn--gold" disabled={sending}>
                    {sending ? 'Sending…' : <>Get My Free Quote <RiArrowRightLine size={18} /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
