import { process } from '../lib/data';

export default function Process() {
  return (
    <section className="section section--light" id="process">
      <div className="container">
        <div className="sec-header--center nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--dark">Our Process</span>
          <h2 className="sec-heading--dark">
            From Click to <span className="sec-red">Customer</span>
          </h2>
          <div className="sec-rule" />
          <p className="sec-body--dark" style={{ maxWidth: 560 }}>
            A simple, fast, four-step path — designed to get you a page that converts
            without the endless back-and-forth.
          </p>
        </div>

        <div className="lp-process__grid">
          {process.map((step, i) => (
            <div key={step.no} className={`lp-step nh-reveal nh-delay-${(i % 4) + 1}`}>
              <div className="lp-step__no">{step.no}</div>
              <h3 className="lp-step__title">{step.title}</h3>
              <p className="lp-step__body">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
