import { useState } from 'react';
import './Page.css';
import { agency, services } from '../data/index.js';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', message: ''
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up form submission (EmailJS, Formspree, backend API, etc.)
    setSent(true);
  };

  return (
    <main className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="page-hero section--navy" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div className="page-hero__pattern" />
        <div className="container">
          <div className="contact-grid">

            {/* Left info */}
            <div className="contact-info">
              <p className="section-label">Get in Touch</p>
              <h1 className="display-lg page-hero__title" style={{ color: 'var(--white)' }}>
                Let's grow your<br />business together
              </h1>
              <p className="body-lg" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-xl)' }}>
                Fill in the form and one of our strategists will get back to you within 24 hours
                with a tailored plan for your business. No pressure, no jargon — just honest advice.
              </p>
              <div className="contact-info-items">
                <div className="contact-info-item">
                  <span className="contact-info-item__icon">✉</span>
                  <div>
                    <p className="contact-info-item__label">Email</p>
                    <a href={`mailto:${agency.email}`} className="contact-info-item__val">{agency.email}</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-item__icon">📞</span>
                  <div>
                    <p className="contact-info-item__label">Phone</p>
                    <a href={`tel:${agency.phone}`} className="contact-info-item__val">{agency.phone}</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-item__icon">📍</span>
                  <div>
                    <p className="contact-info-item__label">Address</p>
                    <p className="contact-info-item__val">{agency.address}</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-item__icon">⏰</span>
                  <div>
                    <p className="contact-info-item__label">Business Hours</p>
                    <p className="contact-info-item__val">Mon – Fri: 9 AM – 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="contact-form-wrap">
              {sent ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                    Message received!
                  </h2>
                  <p style={{ color: 'var(--gray-700)' }}>
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2>Send us a message</h2>
                  <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text" name="name" required value={form.name}
                        onChange={handleChange}
                        className="form-input" placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email" name="email" required value={form.email}
                        onChange={handleChange}
                        className="form-input" placeholder="john@company.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel" name="phone" value={form.phone}
                        onChange={handleChange}
                        className="form-input" placeholder="+91 00000 00000"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company</label>
                      <input
                        type="text" name="company" value={form.company}
                        onChange={handleChange}
                        className="form-input" placeholder="Company Name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Service Interested In</label>
                      <select name="service" value={form.service} onChange={handleChange} className="form-select">
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Monthly Budget</label>
                      <select name="budget" value={form.budget} onChange={handleChange} className="form-select">
                        <option value="">Select budget range</option>
                        <option value="under-10k">Under ₹10,000</option>
                        <option value="10k-25k">₹10,000 – ₹25,000</option>
                        <option value="25k-50k">₹25,000 – ₹50,000</option>
                        <option value="50k-1L">₹50,000 – ₹1,00,000</option>
                        <option value="above-1L">Above ₹1,00,000</option>
                      </select>
                    </div>
                    <div className="form-group form-group--full">
                      <label className="form-label">Message *</label>
                      <textarea
                        name="message" required value={form.message}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Tell us about your business, goals, and how we can help..."
                      />
                    </div>
                    <div className="form-submit">
                      <button type="submit" className="btn btn-primary">
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
