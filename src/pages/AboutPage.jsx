import { useEffect } from 'react';
import { team, stats } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';
import {
  RiTeamLine, RiTrophyLine, RiLightbulbLine, RiRocketLine, RiBarChartLine,
  RiGlobalLine, RiPieChartLine, RiTimeLine, RiEditLine, RiLineChartLine,
  RiCheckDoubleLine, RiMedalLine,
} from 'react-icons/ri';
import { FiUsers, FiTrendingUp, FiZap } from 'react-icons/fi';
import './Home.css';
import './ServiceDetail.css';

const G = '#F97316';
const ABOUT_TILES = Array.from({ length: 90 }, (_, i) => ([
  { name: 'Our Team',    Icon: RiTeamLine,        color: G },
  { name: 'People',      Icon: FiUsers,           color: G },
  { name: 'Vision',      Icon: RiLightbulbLine,   color: G },
  { name: 'Excellence',  Icon: RiTrophyLine,      color: G },
  { name: 'Growth',      Icon: FiTrendingUp,      color: G },
  { name: 'Strategy',    Icon: RiPieChartLine,    color: G },
  { name: 'Speed',       Icon: FiZap,             color: G },
  { name: 'Global',      Icon: RiGlobalLine,      color: G },
  { name: 'Mission',     Icon: RiRocketLine,      color: G },
  { name: 'Results',     Icon: RiBarChartLine,    color: G },
  { name: 'Creative',    Icon: RiEditLine,        color: G },
  { name: 'Timeline',    Icon: RiTimeLine,        color: G },
  { name: 'Delivery',    Icon: RiCheckDoubleLine, color: G },
  { name: 'Performance', Icon: RiLineChartLine,   color: G },
  { name: 'Awards',      Icon: RiMedalLine,       color: G },
])[i % 15]);

export default function AboutPage() {
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-page-dark">
      {/* ── Page Hero ── */}
      <section className="nh-hero sd-hero">
        <div className="nh-hero__brands" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {ABOUT_TILES.map((item, i) => (
            <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': item.color }}>
              <item.Icon className="nh-hero__brand-icon" />
              <span className="nh-hero__brand-label">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="nh-hero__overlay" />

        <div className="container sd-hero__inner">
          <div className="nh-hero__center">
            <span className="sec-eyebrow sec-eyebrow--light nh-reveal">Our Story</span>
            <h1 className="nh-hero__heading nh-reveal nh-delay-1" style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}>
              WE'RE THE TEAM BEHIND<br />
              <span className="nh-hero__red">YOUR GROWTH.</span>
            </h1>
            <div className="nh-hero__underline nh-reveal nh-delay-2" />
            <p className="sd-hero__why nh-reveal nh-delay-3" style={{ fontSize: '1.25rem' }}>
              We're a passionate team of digital marketers, developers, and growth strategists
              on a mission to help businesses thrive online.
            </p>
          </div>
        </div>

        {/* ── Stats Bar Inside Hero ── */}
        <div className="nh-hero__stats-bar nh-reveal nh-delay-4">
          {stats.map((s) => (
            <div key={s.label} className="nh-hero__stat-item">
              <span className="nh-hero__stat-val">{s.value}{s.suffix}</span>
              <span className="nh-hero__stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Section (Light/White) ── */}
      <section className="sec-about" style={{ padding: '7rem 0' }}>
        <div className="container sec-about__inner" style={{ alignItems: 'flex-start' }}>
          
          <div className="sec-about__left nh-reveal-left">
            <span className="sec-eyebrow sec-eyebrow--dark">Who We Are</span>
            <h2 className="sec-heading--dark" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              BUILT TO GROW<br />
              <span className="sec-red-dark">BUSINESSES.</span>
            </h2>
            <div className="sec-rule--red" />
            <p className="sec-body--dark">
              MAJ Digital was founded with a simple belief: every business deserves a
              powerful digital presence. We saw too many great businesses struggling online —
              not because of a bad product, but because of weak websites, invisible search rankings,
              and poorly managed ad spend. We set out to fix that.
            </p>
            <p className="sec-body--dark" style={{ marginTop: '1rem' }}>
              Today, we're a full-service digital marketing team delivering transparent,
              results-driven campaigns that create real business impact via Website Development,
              Landing Pages, SEO, SMO, and Google Ads.
            </p>
          </div>

          <div className="sec-about__right nh-reveal nh-delay-1">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              {[
                  { title: 'Our Mission',  body: 'To help businesses across India and the world build a powerful digital presence that drives real, measurable growth.' },
                  { title: 'Our Vision',   body: 'To be the most trusted digital growth partner for ambitious businesses — known for results, transparency, and lasting impact.' },
                  { title: 'Our Values',   body: 'Integrity, accountability, and relentless curiosity. We treat every client\'s budget as if it were our own and never stop optimising.' },
                  { title: 'Our Promise',  body: 'No vanity metrics — only real results. We commit to clear KPIs, honest reporting, and strategies that deliver genuine business growth.' },
              ].map((v, i) => (
                <div key={v.title} className="sec-about__card" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div>
                    <h4 className="sec-about__card-title" style={{ color: '#F97316', fontSize: '1.1rem' }}>{v.title}</h4>
                    <p className="sec-about__card-desc" style={{ marginTop: '0.4rem', color: '#4A5568' }}>{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Team Section (Dark Results Theme) ── */}
      <section className="sec-results">
        <div className="sec-results__glow" style={{ top: '20%', left: '80%' }}/>
        <div className="container sec-results__inner">
          <div className="sec-results__header nh-reveal">
            <span className="sec-eyebrow sec-eyebrow--light">The Team</span>
            <h2 className="sec-heading--light">
              MEET THE <span className="sec-red-light">PEOPLE.</span>
            </h2>
            <div className="sec-rule--red" />
            <p className="sec-body--light">The strategists, developers, and creatives behind your campaigns.</p>
          </div>

          <div className="sec-results__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {team.map((member, i) => (
              <div key={member.id} className="sec-result-card nh-reveal" style={{ transitionDelay: `${i * 0.1}s`, alignItems: 'center', textAlign: 'center' }}>
                <div 
                  className="sec-result-card__avatar" 
                  style={{
                    width: '100%', height: '180px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
                    fontSize: '4rem', color: '#F97316', fontWeight: 900, fontFamily: 'var(--font-display-cond)'
                  }}
                >
                  {member.image ? <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : member.name.charAt(0)}
                </div>
                
                <div style={{ marginTop: '0.5rem', width: '100%' }}>
                  <h4 className="sec-result-card__title" style={{ fontSize: '1.4rem' }}>{member.name}</h4>
                  <p className="sec-result-card__service" style={{ margin: '0.4rem 0 1rem' }}>{member.role}</p>
                  <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '0 auto 1rem' }} />
                  <p className="sec-result-card__desc" style={{ fontSize: '0.9rem' }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        color="#F97316"
        quote={`"Behind every great brand is a team that believed in it before the world did. That's us."`}
        sub="You now know who we are and what we stand for. Let's talk about what we can build together — free, no pressure."
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        /* ── Hero overlay: edge vignette, not center blob ── */
        .about-page-dark .nh-hero__overlay {
          background: linear-gradient(180deg,
            rgba(6,12,21,0.82) 0%,
            rgba(6,12,21,0.18) 20%,
            rgba(6,12,21,0.10) 50%,
            rgba(6,12,21,0.18) 80%,
            rgba(6,12,21,0.72) 100%
          ) !important;
        }
        .about-page-dark .nh-hero__heading {
          text-shadow: 0 2px 32px rgba(6,12,21,0.85), 0 0 8px rgba(6,12,21,0.6) !important;
        }
        /* ── Page Specific Theme: Sunset Orange ── */
        .about-page-dark .sec-results__glow { background: radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%) !important; }
        .about-page-dark .nh-hero__red,
        .about-page-dark .sec-red-light,
        .about-page-dark .sec-red-dark,
        .about-page-dark .sec-about__card-title,
        .about-page-dark .sec-result-card__avatar { color: #F97316 !important; }
        .about-page-dark .sec-rule--red { background: #F97316 !important; }
        .about-page-dark .nh-hero__underline { background: #F97316 !important; }
        .about-page-dark .nh-hero__stat-val { color: #F97316 !important; text-shadow: 0 0 24px rgba(249,115,22,0.45) !important; }
        .about-page-dark .sec-btn--red { background: #F97316 !important; border-color: #F97316 !important; color: #ffffff !important; }
        .about-page-dark .sec-btn--red:hover { background: #EA580C !important; border-color: #EA580C !important; }
        .about-page-dark .sd-pricing-badge { background: #F97316 !important; }
        .about-page-dark .sd-pricing-name,
        .about-page-dark .sd-price-val { color: #F97316 !important; }
        .about-page-dark .sd-feature-icon { color: #F97316 !important; }
        .about-page-dark .sd-pricing-card--popular { border-color: #F97316 !important; box-shadow: 0 0 30px rgba(249,115,22,0.2) !important; }
      `}} />
    </main>
  );
}
