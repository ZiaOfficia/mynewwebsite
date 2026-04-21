import { useState, useEffect } from 'react';
import { agency, services } from '../data/index.js';
import {
  RiMailLine, RiPhoneLine, RiMessage2Line, RiMapPin2Line, RiTeamLine,
  RiTimeLine, RiRocketLine, RiTrophyLine, RiLightbulbLine, RiGlobalLine,
  RiCalendarLine, RiCustomerService2Line, RiSendPlaneLine, RiCheckDoubleLine,
  RiBarChartLine,
} from 'react-icons/ri';
import { FiZap } from 'react-icons/fi';
import './Home.css';
import './ServiceDetail.css';

const E = '#D946EF';
const CONTACT_TILES = Array.from({ length: 90 }, (_, i) => ([
  { name: 'Email Us',    Icon: RiMailLine,             color: E },
  { name: 'Call Us',     Icon: RiPhoneLine,            color: E },
  { name: 'Live Chat',   Icon: RiMessage2Line,         color: E },
  { name: 'Location',    Icon: RiMapPin2Line,          color: E },
  { name: 'Our Team',    Icon: RiTeamLine,             color: E },
  { name: 'Fast Reply',  Icon: FiZap,                  color: E },
  { name: '24 Hours',    Icon: RiTimeLine,             color: E },
  { name: 'Schedule',    Icon: RiCalendarLine,         color: E },
  { name: 'Support',     Icon: RiCustomerService2Line, color: E },
  { name: 'Send',        Icon: RiSendPlaneLine,        color: E },
  { name: 'Delivered',   Icon: RiCheckDoubleLine,      color: E },
  { name: 'Anywhere',    Icon: RiGlobalLine,           color: E },
  { name: 'Strategy',    Icon: RiLightbulbLine,        color: E },
  { name: 'Get Started', Icon: RiRocketLine,           color: E },
  { name: 'Results',     Icon: RiTrophyLine,           color: E },
])[i % 15]);

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', message: ''
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="contact-page-dark" style={{ background: '#060c15', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="nh-hero__brands" aria-hidden="true" style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 0 }}>
        {CONTACT_TILES.map((item, i) => (
          <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': item.color }}>
            <item.Icon className="nh-hero__brand-icon" />
            <span className="nh-hero__brand-label">{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 'calc(var(--header-h) + 4rem)', paddingBottom: '7rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--light">Get in Touch</span>
          <h1 className="nh-hero__heading" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', marginBottom: '1rem' }}>
            LET'S GROW YOUR<br />
            <span className="nh-hero__red">BUSINESS.</span>
          </h1>
          <div className="sec-rule--red" style={{ margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Fill in the form and one of our strategists will get back to you within 24 hours. No pressure, no jargon — just honest advice.
          </p>
        </div>

        {/* Stats band */}
        <div className="nh-reveal nh-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', borderRadius: '12px', marginBottom: '4rem', overflow: 'hidden' }}>
          {[
            { val: '<24h',  lbl: 'Response Time'      },
            { val: '150+',  lbl: 'Projects Delivered'  },
            { val: '4.9★',  lbl: 'Client Rating'       },
            { val: 'Free',  lbl: 'Initial Audit'        },
          ].map((s, i) => (
            <div key={s.lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '1.6rem 1rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <span className="nh-hero__stat-val" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.4rem)' }}>{s.val}</span>
              <span className="nh-hero__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>

        <div className="contact-wrapper" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem', alignItems: 'start', maxWidth: 1100, margin: '0 auto' }}>
          
          {/* ── Left Info (Dark Theme) ── */}
          <div className="nh-reveal-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '1.6rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Direct <span style={{ color: '#D946EF' }}>Contact</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D946EF', marginBottom: '0.4rem' }}>Email</p>
                <a href={`mailto:${agency.email}`} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', textDecoration: 'none' }}>{agency.email}</a>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D946EF', marginBottom: '0.4rem' }}>Phone</p>
                <a href={`tel:${agency.phone}`} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', textDecoration: 'none' }}>{agency.phone}</a>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D946EF', marginBottom: '0.4rem' }}>Address</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.5 }}>{agency.address}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D946EF', marginBottom: '0.4rem' }}>Business Hours</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}>Mon – Fri: 9 AM – 6 PM</p>
              </div>
            </div>
          </div>

          {/* ── Right Form (Dark Glassmorphism) ── */}
          <div className="nh-reveal nh-delay-1" style={{ background: 'rgba(13,27,42,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '3rem' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
                <h2 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '2.5rem', color: '#ffffff', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  MESSAGE <span style={{ color: '#D946EF' }}>RECEIVED.</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="dark-form">
                <style dangerouslySetInnerHTML={{__html:`
                  .dark-form input, .dark-form select, .dark-form textarea {
                    width: 100%; padding: 1rem 1.25rem; background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                    color: #fff; font-family: var(--font-body); font-size: 0.95rem;
                    transition: all 0.3s ease; outline: none;
                  }
                  .dark-form input:focus, .dark-form select:focus, .dark-form textarea:focus {
                    border-color: #D946EF; background: rgba(255,255,255,0.06); box-shadow: 0 0 16px rgba(16,185,129,0.15);
                  }
                  .dark-form label {
                    display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.08em; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem;
                  }
                  .dark-form select option { background: #0D1B2A; color: #fff; }
                `}}/>
                
                <div style={{ gridColumn: 'span 1' }}>
                  <label>Full Name *</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <label>Email *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="john@company.com" />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <label>Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <label>Company</label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company Name" />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <label>Service</label>
                  <select name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select a service</option>
                    {services.map((s) => (<option key={s.id} value={s.id}>{s.title}</option>))}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <label>Monthly Budget</label>
                  <select name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Select budget range</option>
                    <option value="under-10k">Under ₹10,000</option>
                    <option value="10k-25k">₹10,000 – ₹25,000</option>
                    <option value="25k-50k">₹25,000 – ₹50,000</option>
                    <option value="50k-1L">₹50,000 – ₹1,00,000</option>
                    <option value="above-1L">Above ₹1,00,000</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label>Message *</label>
                  <textarea name="message" required value={form.message} onChange={handleChange} placeholder="Tell us about your goals..." style={{ minHeight: '140px', resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                  <button type="submit" className="sec-btn sec-btn--red" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1.2rem' }}>
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .contact-wrapper { grid-template-columns: 1fr !important; }
          .contact-stats-band { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .dark-form > div { grid-column: span 2 !important; }
        }
        /* ── Hero overlay: edge vignette, not center blob ── */
        .contact-page-dark .nh-hero__overlay {
          background: linear-gradient(180deg,
            rgba(6,12,21,0.82) 0%,
            rgba(6,12,21,0.18) 20%,
            rgba(6,12,21,0.10) 50%,
            rgba(6,12,21,0.18) 80%,
            rgba(6,12,21,0.72) 100%
          ) !important;
        }
        .contact-page-dark .nh-hero__heading {
          text-shadow: 0 2px 32px rgba(6,12,21,0.85), 0 0 8px rgba(6,12,21,0.6) !important;
        }
        /* ── Page Specific Theme: Magenta ── */
        .contact-page-dark .nh-hero__red,
        .contact-page-dark .sec-red-light,
        .contact-page-dark .sec-red-dark { color: #D946EF !important; }
        .contact-page-dark .sec-rule--red { background: #D946EF !important; }
        .contact-page-dark .nh-hero__underline { background: #D946EF !important; }
        .contact-page-dark .nh-hero__stat-val { color: #D946EF !important; text-shadow: 0 0 24px rgba(217,70,239,0.45) !important; }
        .contact-page-dark .sec-btn--red { background: #D946EF !important; border-color: #D946EF !important; }
        .contact-page-dark .sec-btn--red:hover { background: #C026D3 !important; border-color: #C026D3 !important; }
        .contact-page-dark .sd-pricing-badge { background: #D946EF !important; }
        .contact-page-dark .sd-pricing-name,
        .contact-page-dark .sd-price-val { color: #D946EF !important; }
        .contact-page-dark .sd-feature-icon { color: #D946EF !important; }
        .contact-page-dark .sd-pricing-card--popular { border-color: #D946EF !important; box-shadow: 0 0 30px rgba(217,70,239,0.2) !important; }
      `}} />
    </main>
  );
}
