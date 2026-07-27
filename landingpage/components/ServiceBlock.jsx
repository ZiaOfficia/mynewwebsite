import { RiCheckLine, RiCheckDoubleLine, RiArrowRightLine } from 'react-icons/ri';

/* Renders one of the two service offers: copy + result callout + feature grid
   on one side, a floating stat-card cluster and pricing beneath. `index`
   controls which side the copy sits on (alternating layout). */
export default function ServiceBlock({ service, index }) {
  const styleVars = {
    '--svc-accent': service.accent,
    '--svc-rgb': service.accentRgb,
  };

  return (
    <section
      id={service.id}
      className={`section section--dark lp-service lp-service--${index}`}
      style={styleVars}
    >
      <div className="lp-service__glow" />
      <div className="container">
        <div className="lp-service__inner">
          {/* ── Copy ── */}
          <div className="lp-service__copy nh-reveal-left">
            <div className="lp-service__icon"><service.Icon /></div>
            <span className="sec-eyebrow sec-eyebrow--light" style={{ color: service.accent }}>
              {service.eyebrow}
            </span>
            <h2 className="lp-service__heading">
              {service.title} <span className="accent">{service.titleRest}</span>
            </h2>
            <p className="lp-service__tagline">{service.tagline}</p>
            <p className="lp-service__intro">{service.intro}</p>

            <div className="lp-service__result">
              <RiCheckDoubleLine className="lp-service__result-icon" />
              <p><strong>Real result:</strong> {service.result}</p>
            </div>

            <div className="lp-service__features">
              {service.features.map((f) => (
                <span key={f} className="lp-feature">
                  <RiCheckLine size={18} /> {f}
                </span>
              ))}
            </div>

            <a href="#lead-form" className="sec-btn sec-btn--red">
              Start My {service.title === 'Websites' ? 'Website' : 'Landing Page'}
              <RiArrowRightLine size={18} />
            </a>
          </div>

          {/* ── Visual: floating stat cluster ── */}
          <div className="lp-service__visual nh-reveal nh-delay-2">
            {service.stats.map((s) => (
              <div key={s.lbl} className="lp-stat-card">
                <div className="lp-stat-card__val">{s.val}</div>
                <div className="lp-stat-card__lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="nh-reveal" style={{ marginTop: '4rem' }}>
          <div className="lp-pricing">
            {service.packages.map((pkg) => (
              <div key={pkg.name} className={`lp-price-card ${pkg.popular ? 'lp-price-card--popular' : ''}`}>
                {pkg.popular && <span className="lp-price-badge">Most Popular</span>}
                <h3 className="lp-price-card__name">{pkg.name}</h3>
                <div className="lp-price-card__price">
                  {pkg.oldPrice && <span className="lp-price-card__old">{pkg.oldPrice}</span>}
                  <span className="lp-price-card__val">{pkg.price}</span>
                </div>
                <p className="lp-price-card__tagline">{pkg.tagline}</p>
                <ul className="lp-price-card__features">
                  {pkg.features.map((f) => (
                    <li key={f}><RiCheckLine size={18} /> {f}</li>
                  ))}
                </ul>
                <a href="#lead-form" className={`sec-btn ${pkg.popular ? 'sec-btn--red' : 'sec-btn--outline-light'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
