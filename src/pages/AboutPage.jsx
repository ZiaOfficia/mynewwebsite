import './Page.css';
import { team, stats } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';

export default function AboutPage() {
  return (
    <main className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="page-hero section--navy">
        <div className="page-hero__pattern" />
        <div className="container page-hero__inner">
          <p className="section-label">Our Story</p>
          <h1 className="display-lg page-hero__title">
            We're the team behind<br />your growth
          </h1>
          <p className="body-lg page-hero__sub">
            We're a passionate team of digital marketers, developers, and growth strategists
            on a mission to help businesses across India and beyond thrive online.
          </p>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="section section--white">
        <div className="container">
          <div className="about-grid">
            {/* Visual placeholder */}
            <div className="about-visual">
              <div className="about-visual__pattern" />
              <div className="about-visual__placeholder">
                <p className="about-visual__placeholder-label">Agency Photo or Video</p>
                <p className="about-visual__placeholder-text">Your team in action</p>
              </div>
            </div>

            {/* Copy */}
            <div className="about-copy">
              <p className="section-label">Who We Are</p>
              <h2 className="display-md">
                Built to grow businesses — not just run campaigns
              </h2>
              <p className="body-lg">
                Squareit Solutions was founded with a simple belief: every business deserves a
                powerful digital presence. We saw too many great businesses struggling online —
                not because of a bad product, but because of weak websites, invisible search rankings,
                and poorly managed ad spend. We set out to fix that.
              </p>
              <p className="body-lg">
                Today, we're a full-service digital marketing team specialising in Website Development,
                Landing Pages, SEO, Social Media Optimisation, and Google Ads. We work with startups,
                SMEs, and established brands across India and internationally — delivering transparent,
                results-driven campaigns that create real business impact.
              </p>
              <div className="divider" />
              <div className="about-values">
                {[
                  { title: 'Our Mission',  body: 'To help businesses across India and the world build a powerful digital presence that drives real, measurable growth.' },
                  { title: 'Our Vision',   body: 'To be the most trusted digital growth partner for ambitious businesses — known for results, transparency, and lasting impact.' },
                  { title: 'Our Values',   body: 'Integrity, accountability, and relentless curiosity. We treat every client\'s budget as if it were our own and never stop optimising.' },
                  { title: 'Our Promise',  body: 'No vanity metrics — only real results. We commit to clear KPIs, honest reporting, and strategies that deliver genuine business growth.' },
                ].map((v) => (
                  <div key={v.title} className="about-value">
                    <p className="about-value__title">{v.title}</p>
                    <p className="about-value__body">{v.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section section--off-white">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat__val">{s.value}{s.suffix}</span>
                <span className="about-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section section--white">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', color: 'var(--navy)' }}>
            <p className="section-label" style={{ justifyContent: 'center' }}>The Team</p>
            <h2 className="display-md">Meet the people behind your campaigns</h2>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-card__avatar">
                  {member.image
                    ? <img src={member.image} alt={member.name} />
                    : <span className="team-card__initial">{member.name.charAt(0)}</span>
                  }
                </div>
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role">{member.role}</p>
                <p className="team-card__bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
