import { Link } from 'react-router-dom';
import './Footer.css';
import { agency, navLinks, services } from '../../data/index.js';
import BrandName from '../BrandName.jsx';

/* Decorative greetings — visual texture only, hidden from screen readers */
const GREETINGS = [
  { word: 'Welcome',          top: '10%', left: '6%',  size: 1.5, delay: 0 },
  { word: 'नमस्ते',            top: '64%', left: '12%', size: 1.2, delay: 2 },
  { word: 'Bienvenue',        top: '22%', left: '30%', size: 1.0, delay: 4 },
  { word: 'أهلاً وسهلاً',       top: '72%', left: '40%', size: 1.4, delay: 1 },
  { word: 'ようこそ',          top: '12%', left: '58%', size: 1.1, delay: 3 },
  { word: '欢迎',             top: '58%', left: '68%', size: 1.5, delay: 5 },
  { word: 'Bienvenido',       top: '30%', left: '80%', size: 1.0, delay: 2.5 },
  { word: 'Willkommen',       top: '80%', left: '78%', size: 0.9, delay: 4.5 },
  { word: 'Bem-vindo',        top: '86%', left: '22%', size: 1.0, delay: 1.5 },
  { word: 'Добро пожаловать', top: '40%', left: '48%', size: 0.85, delay: 3.5 },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* ── Top pattern strip ── */}
      <div className="footer__strip" />

      {/* ── Decorative background layers ── */}
      <div className="footer__map" aria-hidden="true" />
      <div className="footer__blob footer__blob--red" aria-hidden="true" />
      <div className="footer__blob footer__blob--blue" aria-hidden="true" />
      <div className="footer__greetings" aria-hidden="true">
        {GREETINGS.map((g) => (
          <span
            key={g.word}
            className="footer__greeting"
            style={{ top: g.top, left: g.left, fontSize: `${g.size}rem`, animationDelay: `${g.delay}s` }}
          >
            {g.word}
          </span>
        ))}
      </div>

      <div className="footer__main">
        <div className="container footer__grid">

          {/* ── Brand col ── */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-mark">H<span className="logo-hb-b">B</span></span>
              <span className="footer__logo-text"><BrandName name={agency.name} /></span>
            </Link>
            <p className="footer__tagline">{agency.description}</p>
            <div className="footer__socials">
              {Object.entries(agency.social).map(([key, href]) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                   className="footer__social-link" aria-label={key}>
                  <SocialIcon name={key} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Services col ── */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Services</h4>
            <ul className="footer__col-list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.slug}`} className="footer__link">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company col ── */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Company</h4>
            <ul className="footer__col-list">
              <li><Link to="/about"         className="footer__link">About Us</Link></li>
              <li><Link to="/case-studies"  className="footer__link">Case Studies</Link></li>
              <li><Link to="/blog"          className="footer__link">Blog</Link></li>
              <li><Link to="/contact"       className="footer__link">Contact</Link></li>
              <li><Link to="/careers"       className="footer__link">Careers</Link></li>
            </ul>
          </div>

          {/* ── Contact col ── */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Get in Touch</h4>
            <ul className="footer__contact-list">
              <li>
                <span className="footer__contact-icon">✉</span>
                <a href={`mailto:${agency.email}`} className="footer__link">{agency.email}</a>
              </li>
              <li>
                <span className="footer__contact-icon">📞</span>
                <a href={`tel:${agency.phone}`} className="footer__link">{agency.phone}</a>
              </li>
              <li>
                <span className="footer__contact-icon">📍</span>
                <span className="footer__contact-text">{agency.address}</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="footer__newsletter">
              <p className="footer__newsletter-label">Get marketing tips</p>
              <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="footer__newsletter-input"
                  aria-label="Email address"
                />
                <button type="submit" className="footer__newsletter-btn">→</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {year} {agency.name}. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/privacy" className="footer__link footer__link--sm">Privacy Policy</Link>
            <Link to="/terms"   className="footer__link footer__link--sm">Terms of Service</Link>
            <Link to="/sitemap" className="footer__link footer__link--sm">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Inline Social Icons ─────────────────────────────────── */
function SocialIcon({ name }) {
  const icons = {
    instagram: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    facebook: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
    twitter: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
      </svg>
    ),
    linkedin: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    youtube: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
      </svg>
    ),
  };
  return icons[name] || null;
}
