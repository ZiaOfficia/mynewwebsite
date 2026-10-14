'use client';

import { useState } from 'react';
import { agency, services } from '../data/index.js';
import { submitToSheet } from '../lib/sheets.js';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', message: '',
  });
  const [sent, setSent]           = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState('');

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      await submitToSheet({
        formType: 'contact',
        fullName: form.name,
        email:    form.email,
        phone:    form.phone,
        company:  form.company,
        service:  form.service,
        budget:   form.budget,
        message:  form.message,
      });
      setSent(true);
    } catch {
      setSendError('Your message did not send. Check your connection and try again, or call us.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="contact-page">

      <header className="phead">
        <div className="container phead__grid phead__grid--single">
          <h1 className="phead__title">Tell us what you need.</h1>
          <p className="lede phead__lede">
            An engineer from the team will reply within 24 hours with honest advice
            on what it takes, how long and what it costs.
          </p>
        </div>
      </header>

      <section className="contact-wrap">
        <div className="container contact">
          <div className="contact__info">
            <div className="contact__item">
              <h2>Phone</h2>
              <a href={`tel:${agency.phone.replace(/\s/g, '')}`}>{agency.phone}</a>
            </div>
            <div className="contact__item">
              <h2>Where we are</h2>
              <p>{agency.address}, working with clients everywhere</p>
            </div>
            <div className="contact__item">
              <h2>Hours</h2>
              <p>Monday to Friday, 9 am to 6 pm</p>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            {sent ? (
              <div className="contact__done" role="status">
                <span className="contact__done-icon" aria-hidden="true">✓</span>
                <h2 className="t-2">Message sent</h2>
                <p className="lede">Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We'll reply within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="c-name">Name *</label>
                  <input id="c-name" type="text" name="name" required autoComplete="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email *</label>
                  <input id="c-email" type="email" name="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@company.com" />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Phone</label>
                  <input id="c-phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
                <div className="field">
                  <label htmlFor="c-company">Business name</label>
                  <input id="c-company" type="text" name="company" autoComplete="organization" value={form.company} onChange={handleChange} placeholder="Your business" />
                </div>
                <div className="field">
                  <label htmlFor="c-service">Service</label>
                  <select id="c-service" name="service" value={form.service} onChange={handleChange}>
                    <option value="">Choose a service</option>
                    {services.map((s) => (<option key={s.id} value={s.id}>{s.title}</option>))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="c-budget">Monthly budget</label>
                  <select id="c-budget" name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Choose a range</option>
                    <option value="under-10k">Under ₹10,000</option>
                    <option value="10k-25k">₹10,000 – ₹25,000</option>
                    <option value="25k-50k">₹25,000 – ₹50,000</option>
                    <option value="50k-1L">₹50,000 – ₹1,00,000</option>
                    <option value="above-1L">Above ₹1,00,000</option>
                  </select>
                </div>
                <div className="field field--full">
                  <label htmlFor="c-message">What do you need? *</label>
                  <textarea id="c-message" name="message" required value={form.message} onChange={handleChange} placeholder="A few lines about your business and what you'd like built or improved" />
                </div>
                <div className="field--full">
                  {sendError && <p className="form-error" role="alert" style={{ marginBottom: '0.75rem' }}>{sendError}</p>}
                  <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
                    {sending ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
