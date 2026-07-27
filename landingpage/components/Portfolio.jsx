import { portfolio } from '../lib/data';

/* Simple hex → rgba for the translucent tag backgrounds. */
function rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function Portfolio() {
  return (
    <section className="section section--dark" id="work">
      <div className="container">
        <div className="sec-header--center nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--light">Recent Work</span>
          <h2 className="sec-heading--light">
            Results That <span className="sec-royal">Speak</span>
          </h2>
          <div className="sec-rule" />
          <p className="sec-body--light" style={{ maxWidth: 560 }}>
            A snapshot of pages and sites we&apos;ve shipped — and the numbers they moved.
          </p>
        </div>

        <div className="lp-portfolio__grid">
          {portfolio.map((item, i) => (
            <article key={item.title} className={`lp-work-card nh-reveal nh-delay-${(i % 2) + 1}`}>
              <span className="lp-work-card__bar" style={{ background: item.color }} />
              <div className="lp-work-card__top">
                <span
                  className="lp-work-card__tag"
                  style={{ background: rgba(item.color, 0.18), color: item.color }}
                >
                  {item.tag}
                </span>
                <span className="lp-work-card__result" style={{ color: item.color }}>
                  {item.result}
                </span>
              </div>
              <h3 className="lp-work-card__title">{item.title}</h3>
              <p className="lp-work-card__blurb">{item.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
