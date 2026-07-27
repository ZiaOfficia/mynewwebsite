import { whyUs } from '../lib/data';

export default function WhyUs() {
  return (
    <section className="section section--dark" id="why">
      <div className="container">
        <div className="sec-header--center nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--light">Why Choose Us</span>
          <h2 className="sec-heading--light">
            Ad Spend Deserves<br /><span className="sec-red">Pages That Perform</span>
          </h2>
          <div className="sec-rule" />
          <p className="sec-body--light" style={{ maxWidth: 560 }}>
            We only build two things — landing pages and websites — and we build them to do one job:
            turn your paid traffic into paying customers.
          </p>
        </div>

        <div className="lp-why__grid">
          {whyUs.map((item, i) => (
            <div key={item.title} className={`lp-why-card nh-reveal nh-delay-${(i % 4) + 1}`}>
              <div className="lp-why-card__icon"><item.Icon /></div>
              <h3 className="lp-why-card__title">{item.title}</h3>
              <p className="lp-why-card__body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
