import { useState, useEffect, useRef } from 'react';
import { submitToSheet } from '../../lib/sheets.js';
import './BookingModal.css';

const EMPTY_FORM = { datetime: '', name: '', phone: '', email: '' };

/* datetime-local min: current local time, minutes precision */
function nowLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function BookingModal({ open, onClose }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const cardRef = useRef(null);

  /* Reset + lock scroll while the modal is open */
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setErrors({});
    setSent(false);
    setSending(false);
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.__lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.phone.trim()) er.phone = 'Phone number is required.';
    else if (!/^[+()\-\s\d]{7,16}$/.test(form.phone.trim())) er.phone = 'Enter a valid phone number.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = 'Enter a valid email address.';
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) { setErrors(er); return; }
    setSending(true);
    try {
      await submitToSheet({
        formType: 'getStarted',
        freeTime: form.datetime ? form.datetime.replace('T', ' ') : '',
        fullName: form.name.trim(),
        phone:    form.phone.trim(),
        email:    form.email.trim(),
      });
      setSent(true);
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bkm-overlay" onMouseDown={(e) => { if (!cardRef.current?.contains(e.target)) onClose(); }}>
      <div className="bkm-card" ref={cardRef} role="dialog" aria-modal="true" aria-label="Book a free consultation">
        <button className="bkm-close" onClick={onClose} aria-label="Close popup">&times;</button>

        {sent ? (
          <div className="bkm-success">
            <span className="bkm-success__icon">✓</span>
            <h3 className="bkm-title">Thank You!</h3>
            <p className="bkm-success__text">
              We've received your details and will contact you at your selected time.
            </p>
            <button className="bkm-btn bkm-btn--primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h3 className="bkm-title">Let's Get Started</h3>
            <p className="bkm-sub">Tell us when you're free and we'll call you back.</p>

            <form className="bkm-form" onSubmit={handleSubmit} noValidate>
              <label className="bkm-field">
                <span className="bkm-label">When will you be free? <small>(optional)</small></span>
                <input
                  type="datetime-local"
                  min={nowLocal()}
                  value={form.datetime}
                  onChange={setField('datetime')}
                  className={errors.datetime ? 'bkm-input bkm-input--error' : 'bkm-input'}
                />
                {errors.datetime && <span className="bkm-error">{errors.datetime}</span>}
              </label>

              <label className="bkm-field">
                <span className="bkm-label">Full Name <small>(optional)</small></span>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={setField('name')}
                  className={errors.name ? 'bkm-input bkm-input--error' : 'bkm-input'}
                />
                {errors.name && <span className="bkm-error">{errors.name}</span>}
              </label>

              <label className="bkm-field">
                <span className="bkm-label">Phone Number <em>*</em></span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={setField('phone')}
                  className={errors.phone ? 'bkm-input bkm-input--error' : 'bkm-input'}
                />
                {errors.phone && <span className="bkm-error">{errors.phone}</span>}
              </label>

              <label className="bkm-field">
                <span className="bkm-label">Email Address <small>(optional)</small></span>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={form.email}
                  onChange={setField('email')}
                  className={errors.email ? 'bkm-input bkm-input--error' : 'bkm-input'}
                />
                {errors.email && <span className="bkm-error">{errors.email}</span>}
              </label>

              {errors.submit && <span className="bkm-error">{errors.submit}</span>}

              <div className="bkm-actions">
                <button type="submit" className="bkm-btn bkm-btn--primary" disabled={sending}>
                  {sending ? 'Submitting…' : 'Submit'}
                </button>
                <button type="button" className="bkm-btn bkm-btn--ghost" onClick={onClose} disabled={sending}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
