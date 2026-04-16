import { Link } from 'react-router-dom';
import './ServicesPreview.css';
import { services } from '../../data/index.js';

export default function ServicesPreview() {
  return (
    <section className="services-prev section section--off-white">
      <div className="container">

        {/* ── Header ── */}
        <div className="services-prev__header">
          <div>
            <p className="section-label">What We Do</p>
            <h2 className="display-md services-prev__title">
              Full-spectrum digital<br />marketing that converts
            </h2>
          </div>
          <div className="services-prev__header-right">
            <p className="body-lg services-prev__desc">
              Placeholder description for your services overview. Explain
              your agency's holistic approach to digital marketing in 2–3
              compelling sentences.
            </p>
            <Link to="/services" className="btn btn-outline-dark">
              View All Services
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="services-prev__grid">
          {services.map((s, i) => (
            <Link
              key={s.id}
              to={`/services/${s.slug}`}
              className="service-card"
              style={{ '--accent': s.color, '--delay': `${i * 0.08}s` }}
            >
              <div className="service-card__icon">{s.icon}</div>
              <div className="service-card__label caption">{s.label}</div>
              <h3 className="service-card__title heading-lg">{s.title}</h3>
              <p className="service-card__summary body-sm">{s.summary}</p>
              <ul className="service-card__features">
                {s.features.slice(0, 3).map((f) => (
                  <li key={f} className="service-card__feature">
                    <span className="service-card__feature-dot" />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="service-card__cta btn-ghost">
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
              <div className="service-card__accent-bar" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
