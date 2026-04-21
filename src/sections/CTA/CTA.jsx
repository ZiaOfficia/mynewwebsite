import { Link } from 'react-router-dom';
import './CTA.css';

function hexToRgb(hex) {
  if (!hex || hex.startsWith('var(')) return '201,168,76';
  const raw = hex.replace('#', '');
  const r = parseInt(raw.substring(0, 2), 16);
  const g = parseInt(raw.substring(2, 4), 16);
  const b = parseInt(raw.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export default function CTA({ color = '#C9A84C' }) {
  const rgb = hexToRgb(color);
  return (
    <section
      className="cta-section section section--navy"
      style={{ '--cta-accent': color, '--cta-accent-rgb': rgb }}
    >
      <div className="cta-section__pattern" />
      <div className="cta-section__glow" />

      <div className="container cta-section__inner">
        <div className="cta-section__content">
          <p className="section-label cta-section__label">You're One Click Away</p>
          <h2 className="display-lg cta-section__heading">
            Your growth story<br />starts right here.
          </h2>
          <p className="body-lg cta-section__quote">
            "The distance between where you are and where you want to be is just one decision."
          </p>
          <p className="body-lg cta-section__sub">
            One conversation with MAJ Digital unlocks your brand's real potential.
            Free audit — no lock-ins, no fluff, just results.
          </p>
          <div className="cta-section__actions">
            <Link to="/contact" className="btn cta-section__btn--accent">
              Book Free Strategy Call
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Contact chips ── */}
        <div className="cta-section__chips">
          <a href="mailto:ss4526312@gmail.com" className="cta-chip">
            <span className="cta-chip__icon">✉</span>
            <div>
              <p className="cta-chip__label">Email Us</p>
              <p className="cta-chip__value">ss4526312@gmail.com</p>
            </div>
          </a>
          <a href="tel:+910000000000" className="cta-chip">
            <span className="cta-chip__icon">📞</span>
            <div>
              <p className="cta-chip__label">Call Us</p>
              <p className="cta-chip__value">+91 00000 00000</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
