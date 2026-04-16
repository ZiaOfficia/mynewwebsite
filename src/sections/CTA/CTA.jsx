import { Link } from 'react-router-dom';
import './CTA.css';

export default function CTA() {
  return (
    <section className="cta-section section section--navy">
      <div className="cta-section__pattern" />
      <div className="cta-section__glow" />

      <div className="container cta-section__inner">
        <div className="cta-section__content">
          <p className="section-label">Let's Work Together</p>
          <h2 className="display-lg cta-section__heading">
            Ready to grow your<br />digital presence?
          </h2>
          <p className="body-lg cta-section__sub">
            Book a free strategy call. We'll review your current digital presence
            and show you exactly where the growth opportunities are — no obligation.
          </p>
          <div className="cta-section__actions">
            <Link to="/contact" className="btn btn-primary cta-section__btn">
              Get a Free Audit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/services" className="btn btn-outline">
              Explore Services
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
          <a href="tel:+10000000000" className="cta-chip">
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
