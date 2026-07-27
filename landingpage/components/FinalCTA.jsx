import { RiArrowRightLine } from 'react-icons/ri';

export default function FinalCTA() {
  return (
    <section className="section section--dark lp-final">
      <div className="lp-final__glow" />
      <div className="container lp-final__inner nh-reveal">
        <h2 className="lp-final__heading">
          Ready to Turn Ad Spend<br /><span className="gold">Into Real Revenue?</span>
        </h2>
        <p className="lp-final__sub">
          Get a free, no-pressure quote in 24 hours. We&apos;ll show you exactly how a
          conversion-focused page can lower your cost per lead — starting this week.
        </p>
        <a href="#lead-form" className="sec-btn sec-btn--gold sec-btn--lg">
          Get My Free Quote <RiArrowRightLine size={20} />
        </a>
      </div>
    </section>
  );
}
