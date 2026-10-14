import { team } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';

const VALUES = [
  { title: 'Direct',      body: 'You talk to the person doing the work. No account managers relaying messages, no waiting on a chain of emails.' },
  { title: 'Fair',        body: 'You pay for the work, not for offices, sales teams or a profit margin stacked on top. Prices are agreed before we start.' },
  { title: 'Plain',       body: 'Reports and updates in plain language. If something is not working, we say so, and say what we will change.' },
  { title: 'Hands-on',    body: 'We are engineers who still build every day. The people who plan your project are the people who ship it.' },
];

export default function AboutPage() {
  return (
    <main className="about-page">

      <header className="phead">
        <div className="container phead__grid phead__grid--single">
          <h1 className="phead__title">Engineers who would rather build than bill.</h1>
          <p className="lede phead__lede">
            HiBrands is a small team of working engineers. We started it because we kept
            seeing businesses pay agency prices where most of the money never reached the
            people doing the work.
          </p>
        </div>
      </header>

      <section className="section band-white">
        <div className="container split">
          <h2 className="t-1">Why we work this way</h2>
          <div className="split__body">
            <p>
              A typical agency bill covers account managers, sales commission, office rent,
              HR and a healthy profit margin. The engineering is only one line on it.
            </p>
            <p>
              We cut out everything in the middle. When you work with HiBrands you get the
              engineers directly, for websites, landing pages, SEO, social media and Google Ads,
              at a price that reflects the work and nothing else.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sec-head">
            <h2 className="t-1">What you can expect from us</h2>
          </div>
          <div className="values">
            {VALUES.map((v) => (
              <div key={v.title} className="value">
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-deep">
        <div className="container">
          <div className="sec-head">
            <h2 className="t-1">The people you'll talk to</h2>
            <p>The founders are hands-on in every project.</p>
          </div>
          <div className="team">
            {team.map((m) => (
              <article key={m.id} className="person">
                <span className="person__avatar" aria-hidden={!m.image}>
                  {m.image ? <img src={m.image} alt={m.name} /> : m.name.charAt(0)}
                </span>
                <h3 className="person__name">{m.name}</h3>
                <p className="person__role">{m.role}</p>
                <p className="person__bio">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA sub="Tell us about your business and what you need built. You'll be speaking with one of the people above." />
    </main>
  );
}
