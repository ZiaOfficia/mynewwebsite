import './WhyUs.css';
import { whyUs } from '../../data/index.js';
import { Link } from 'react-router-dom';

export default function WhyUs() {
  return (
    <section className="why-us section section--white">
      <div className="container">
        <div className="why-us__inner">

          {/* ── Left visual ── */}
          <div className="why-us__visual">
            <div className="why-us__visual-card">
              <div className="why-us__visual-pattern" />
              <div className="why-us__visual-content">
                <p className="why-us__visual-eyebrow caption">Agency Story</p>
                <h3 className="why-us__visual-heading display-sm">
                  Placeholder headline about your agency's story
                </h3>
                <p className="body-md why-us__visual-body">
                  Placeholder paragraph — 2–3 sentences about your agency's
                  founding story, mission, and what makes you different.
                </p>
                <Link to="/about" className="btn-ghost">
                  About us
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
            {/* Floating badge */}
            <div className="why-us__badge">
              <span className="why-us__badge-icon">🏆</span>
              <div>
                <p className="why-us__badge-title">Award Winning</p>
                <p className="why-us__badge-sub">Placeholder award name</p>
              </div>
            </div>
          </div>

          {/* ── Right grid ── */}
          <div className="why-us__content">
            <p className="section-label">Why Choose Us</p>
            <h2 className="display-md why-us__heading">
              The agency that puts<br />results first
            </h2>

            <div className="why-us__grid">
              {whyUs.map((item, i) => (
                <div key={item.title} className="why-us__card" style={{ '--d': `${i * 0.1}s` }}>
                  <div className="why-us__card-icon">{item.icon}</div>
                  <h4 className="why-us__card-title heading-sm">{item.title}</h4>
                  <p className="why-us__card-body body-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
