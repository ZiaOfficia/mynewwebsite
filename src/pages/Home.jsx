import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  SiGoogle, SiMeta, SiShopify, SiHubspot, SiSalesforce, SiStripe, SiFigma, SiNotion,
  SiTiktok, SiYoutube, SiSlack, SiCanva, SiSpotify, SiWebflow, SiPinterest, SiTwitch,
  SiMailchimp, SiWoocommerce, SiNetflix, SiAirbnb, SiPaypal, SiSemrush, SiZapier, SiZoom,
  SiGoogleads, SiWordpress, SiReact, SiNextdotjs, SiTailwindcss, SiDiscord, SiDropbox, SiGithub,
} from 'react-icons/si';
import {
  RiSearchLine, RiGlobalLine, RiCodeSSlashLine, RiLayoutLine, RiEditLine,
  RiBarChartLine, RiRocketLine, RiTrophyLine, RiTeamLine, RiMegaphoneLine,
  RiLineChartLine, RiTimeLine, RiCheckDoubleLine, RiLightbulbLine, RiPieChartLine,
  RiBroadcastLine,
} from 'react-icons/ri';
import { FiTrendingUp, FiTarget, FiUsers, FiZap, FiBarChart2 } from 'react-icons/fi';
import './Home.css';

function useReveal() {
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
}

/* ── Brand data ── */
const ALL_BRANDS = [
  { name: 'Google',      Icon: SiGoogle,           color: '#4285F4' },
  { name: 'Meta',        Icon: SiMeta,             color: '#0082FB' },
  { name: 'Shopify',     Icon: SiShopify,          color: '#96BF48' },
  { name: 'HubSpot',     Icon: SiHubspot,          color: '#FF7A59' },
  { name: 'Salesforce',  Icon: SiSalesforce,       color: '#00A1E0' },
  { name: 'Stripe',      Icon: SiStripe,           color: '#635BFF' },
  { name: 'Figma',       Icon: SiFigma,            color: '#F24E1E' },
  { name: 'Notion',      Icon: SiNotion,           color: '#a0a0a0' },
  { name: 'TikTok',      Icon: SiTiktok,           color: '#69C9D0' },
  { name: 'YouTube',     Icon: SiYoutube,          color: '#FF0000' },
  { name: 'Slack',       Icon: SiSlack,            color: '#E01E5A' },
  { name: 'Canva',       Icon: SiCanva,            color: '#00C4CC' },
  { name: 'Spotify',     Icon: SiSpotify,          color: '#1DB954' },
  { name: 'Webflow',     Icon: SiWebflow,          color: '#4353FF' },
  { name: 'Pinterest',   Icon: SiPinterest,        color: '#E60023' },
  { name: 'Twitch',      Icon: SiTwitch,           color: '#9146FF' },
  { name: 'Mailchimp',   Icon: SiMailchimp,        color: '#FFE01B' },
  { name: 'WooCommerce', Icon: SiWoocommerce,      color: '#7F54B3' },
  { name: 'Netflix',     Icon: SiNetflix,          color: '#E50914' },
  { name: 'Airbnb',      Icon: SiAirbnb,           color: '#FF5A5F' },
  { name: 'PayPal',      Icon: SiPaypal,           color: '#003087' },
  { name: 'Semrush',     Icon: SiSemrush,          color: '#FF642D' },
  { name: 'Zapier',      Icon: SiZapier,           color: '#FF4A00' },
  { name: 'Zoom',        Icon: SiZoom,             color: '#2D8CFF' },
  { name: 'Google Ads',  Icon: SiGoogleads,        color: '#FBBC04' },
  { name: 'WordPress',   Icon: SiWordpress,        color: '#21759B' },
  { name: 'React',       Icon: SiReact,            color: '#61DAFB' },
  { name: 'Next.js',     Icon: SiNextdotjs,        color: '#a0a0a0' },
  { name: 'Tailwind',    Icon: SiTailwindcss,  color: '#38BDF8' },
  { name: 'Discord',     Icon: SiDiscord,      color: '#5865F2' },
  { name: 'Dropbox',     Icon: SiDropbox,      color: '#0061FF' },
  { name: 'GitHub',      Icon: SiGithub,       color: '#a0a0a0' },
];
const GRID_TILES = Array.from({ length: 90 }, (_, i) => ALL_BRANDS[i % ALL_BRANDS.length]);

/* ================================================================
   SECTION 1 — HERO  (dark #060c15)
   ================================================================ */
function HeroSection() {
  const brandsRef = useRef(null);
  const posRef    = useRef([]);
  const rafRef    = useRef(null);

  const cachePos = useCallback(() => {
    if (!brandsRef.current) return;
    const chips = brandsRef.current.querySelectorAll('.nh-hero__brand-chip');
    posRef.current = Array.from(chips).map((el) => {
      const r = el.getBoundingClientRect();
      return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
  }, []);

  /* One-shot glow wave on mount: sweeps top→bottom then bottom→top */
  const runWave = useCallback(() => {
    const pts = posRef.current;
    if (!pts.length) return;
    const ys       = pts.map((p) => p.cy);
    const minY     = Math.min(...ys);
    const maxY     = Math.max(...ys);
    const span     = maxY - minY;
    const sigma    = span * 0.18;   // glow band height
    const HALF     = 2000;          // ms per sweep direction
    const start    = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const half    = elapsed < HALF;
      const t       = Math.min(half ? elapsed / HALF : (elapsed - HALF) / HALF, 1);

      /* forward: top → bottom; return: bottom → top */
      const waveY = half
        ? minY - sigma + t * (span + sigma * 2)
        : maxY + sigma - t * (span + sigma * 2);

      pts.forEach(({ el, cy }) => {
        const dist = Math.abs(cy - waveY);
        el.style.setProperty('--intensity', Math.max(0, 1 - dist / sigma).toFixed(3));
      });

      if (elapsed < HALF * 2) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        pts.forEach(({ el }) => el.style.setProperty('--intensity', '0'));
      }
    }
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      cachePos();
      setTimeout(runWave, 60);
    }, 200);
    window.addEventListener('resize', cachePos);
    return () => { clearTimeout(t); window.removeEventListener('resize', cachePos); };
  }, [cachePos, runWave]);

  const onMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const { clientX: mx, clientY: my } = e;
      const R = 240;
      posRef.current.forEach(({ el, cx, cy }) => {
        const d = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
        el.style.setProperty('--intensity', Math.max(0, 1 - d / R).toFixed(3));
      });
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    posRef.current.forEach(({ el }) => el.style.setProperty('--intensity', '0'));
  }, []);

  return (
    <section className="nh-hero" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="nh-hero__glow nh-hero__glow--1" />
      <div className="nh-hero__glow nh-hero__glow--2" />

      <div className="nh-hero__brands" ref={brandsRef} aria-hidden="true">
        {GRID_TILES.map((brand, i) => (
          <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': brand.color }}>
            <brand.Icon className="nh-hero__brand-icon" />
            <span className="nh-hero__brand-label">{brand.name}</span>
          </div>
        ))}
      </div>

      <div className="nh-hero__overlay" />

      <div className="container nh-hero__content">
        <div className="nh-hero__center">
          <h1 className="nh-hero__heading nh-reveal">
            WE BUILD.<br />
            WE RANK.<br />
            <span className="nh-hero__red">WE GROW.</span>
          </h1>
          <div className="nh-hero__underline nh-reveal nh-delay-1" />
          <p className="nh-hero__sub nh-reveal nh-delay-2">
            Your brand. Your audience. Your digital future —<br />
            made measurable by MAJ Digital.
          </p>
        </div>
      </div>

      <div className="nh-hero__stats-bar">
        {[
          { val: '150+', lbl: 'Brands Grown' },
          { val: '95%',  lbl: 'Client Retention' },
          { val: '3.5x', lbl: 'Average ROI' },
          { val: '20+',  lbl: 'Team Members' },
        ].map((s) => (
          <div key={s.lbl} className="nh-hero__stat-item">
            <span className="nh-hero__stat-val">{s.val}</span>
            <span className="nh-hero__stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 2 — MARQUEE TICKER  (red band)
   ================================================================ */
function MarqueeSection() {
  const items = ['RESULTS', 'ROI', 'RANKINGS', 'GROWTH', 'LEADS', 'BRANDS', 'REVENUE', 'TRAFFIC', 'CONVERSIONS', 'SUCCESS'];
  const doubled = [...items, ...items];
  return (
    <div className="sec-marquee">
      <div className="sec-marquee__track">
        {doubled.map((txt, i) => (
          <span key={i} className="sec-marquee__item">
            <span className="sec-marquee__text">{txt}</span>
            <span className="sec-marquee__sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION 3 — WHO WE ARE  (light white)
   ================================================================ */
function AboutSection() {
  const features = [
    { Icon: RiRocketLine,    color: '#CC1F35', title: 'Results First',  desc: 'Every strategy built around measurable outcomes, not vanity metrics.' },
    { Icon: FiTarget,        color: '#4285F4', title: 'Brand Focused',  desc: 'We treat your brand as our own — full transparency, full accountability.' },
    { Icon: RiBarChartLine,  color: '#1DB954', title: 'Data Driven',    desc: 'Real-time reporting so you always know exactly where your money goes.' },
    { Icon: FiUsers,         color: '#9146FF', title: 'Long Term',      desc: 'We build lasting growth partnerships, not one-off campaigns.' },
  ];
  return (
    <section className="sec-about">
      <div className="container sec-about__inner">
        <div className="sec-about__left nh-reveal-left">
          <span className="sec-eyebrow sec-eyebrow--dark">Who We Are</span>
          <h2 className="sec-heading--dark">
            A GROWTH PARTNER<br />
            <span className="sec-red-dark">BUILT FOR YOU.</span>
          </h2>
          <div className="sec-rule--red" />
          <p className="sec-body--dark">
            MAJ Digital accepts and amplifies your brand for who you are and who you want
            to become. We find which channels you excel in, which campaigns you love, and
            which way your brand will grow fastest.
          </p>
          <p className="sec-body--dark">
            From stunning websites to Google page-1 rankings and high-ROI ad campaigns —
            every service is engineered to deliver real, measurable business impact.
          </p>
          <Link to="/about" className="sec-link--dark">
            Our Story <span className="sec-link-arrow">→</span>
          </Link>
        </div>

        <div className="sec-about__right nh-reveal nh-delay-1">
          <div className="sec-about__cards">
            {features.map((f, i) => (
              <div key={f.title} className="sec-about__card" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="sec-about__card-icon" style={{ color: f.color }}>
                  <f.Icon size={26} />
                </span>
                <div>
                  <h4 className="sec-about__card-title">{f.title}</h4>
                  <p className="sec-about__card-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 4 — SERVICES  (dark navy)
   ================================================================ */
function ServicesSection() {
  const services = [
    { Icon: RiSearchLine,      color: '#4285F4', title: 'SEO',              tag: 'Rank & Stay',     desc: 'Technical audits, content strategy, and proven link-building that keeps you on page 1 and growing.', href: '/services/seo' },
    { Icon: RiMegaphoneLine,   color: '#FF7A59', title: 'Social Media',     tag: 'Be Seen',         desc: 'Build your community, grow engagement, and turn followers into loyal paying customers.', href: '/services/smo' },
    { Icon: RiBarChartLine,    color: '#FBBC04', title: 'Google Ads',       tag: 'High ROI',        desc: 'High-performance paid campaigns — every rupee tracked, every conversion counted, every result transparent.', href: '/services/google-ads' },
    { Icon: RiCodeSSlashLine,  color: '#61DAFB', title: 'Web Development',  tag: 'Convert',         desc: 'Fast, mobile-first websites built to rank, load instantly, and turn visitors into enquiries from day one.', href: '/services/web-development' },
    { Icon: RiLayoutLine,      color: '#9146FF', title: 'Landing Pages',    tag: 'Drive Leads',     desc: 'Purpose-built pages with clear messaging and tested conversion flows that turn ad clicks into real business.', href: '/services' },
    { Icon: RiEditLine,        color: '#1DB954', title: 'Content Marketing',tag: 'Tell Your Story', desc: 'Strategic content that educates, attracts, and converts — blogs, videos, emails and more.', href: '/services' },
  ];

  return (
    <section className="sec-services">
      <div className="sec-services__glow-1" />
      <div className="sec-services__glow-2" />
      <div className="container sec-services__inner">
        <div className="sec-services__header nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--light">What We Do</span>
          <h2 className="sec-heading--light">
            SIX SERVICES.<br />
            <span className="sec-red-light">ONE MISSION.</span>
          </h2>
          <div className="sec-rule--red" />
          <p className="sec-body--light">Every tool in our arsenal aimed at one thing — making your brand impossible to ignore online.</p>
        </div>

        <div className="sec-services__grid">
          {services.map((s, i) => (
            <Link key={s.title} to={s.href} className="sec-svc-card nh-reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="sec-svc-card__top">
                <span className="sec-svc-card__icon" style={{ color: s.color }}>
                  <s.Icon size={28} />
                </span>
                <span className="sec-svc-card__tag">{s.tag}</span>
              </div>
              <h3 className="sec-svc-card__title">{s.title}</h3>
              <p className="sec-svc-card__desc">{s.desc}</p>
              <span className="sec-svc-card__arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="sec-services__cta nh-reveal">
          <Link to="/services" className="sec-btn sec-btn--outline-light">View All Services</Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 5 — HOW WE WORK  (light cream #F8F6F2)
   ================================================================ */
function ProcessSection() {
  const steps = [
    { num: '01', title: 'Audit',    desc: 'Deep-dive into your brand, competitors, and digital presence to find exactly where you stand and where the opportunity is.' },
    { num: '02', title: 'Strategy', desc: 'A bespoke growth plan around your goals, budget, and the channels that will move the needle fastest for your business.' },
    { num: '03', title: 'Execute',  desc: 'Our team launches campaigns, builds assets, and publishes content — at pace, with precision, and with zero fluff.' },
    { num: '04', title: 'Optimise', desc: 'Monthly reviews, real-time dashboards, and continuous iteration ensure your results compound and improve over time.' },
  ];
  return (
    <section className="sec-process">
      <div className="container sec-process__inner">
        <div className="sec-process__header nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--dark">How We Work</span>
          <h2 className="sec-heading--dark">
            THE PROCESS BEHIND<br />
            <span className="sec-red-dark">EVERY WIN.</span>
          </h2>
          <div className="sec-rule--red" />
        </div>

        <div className="sec-process__steps">
          {steps.map((s, i) => (
            <div key={s.num} className="sec-process__step nh-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="sec-process__step-top">
                <span className="sec-process__num">{s.num}</span>
                {i < steps.length - 1 && <div className="sec-process__connector" />}
              </div>
              <h3 className="sec-process__title">{s.title}</h3>
              <p className="sec-process__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 6 — RESULTS  (dark #060c15)
   ================================================================ */
function ResultsSection() {
  const cases = [
    {
      Icon: RiSearchLine, iconColor: '#4285F4',
      client: 'TechStart India', service: 'SEO',
      result: '+312%', resultLbl: 'Organic Traffic',
      title: 'From Page 5 to Position 1',
      desc: 'Technical SEO + content strategy took TechStart from invisible to dominating their niche in 6 months.',
    },
    {
      Icon: RiBarChartLine, iconColor: '#FBBC04',
      client: 'StyleHub', service: 'Google Ads',
      result: '4.8x', resultLbl: 'ROAS Achieved',
      title: 'Google Ads ROAS Transformed',
      desc: 'A full account rebuild and creative refresh took their ROAS from 1.2x to 4.8x in just 3 months.',
    },
    {
      Icon: RiCodeSSlashLine, iconColor: '#61DAFB',
      client: 'GreenBuild Co.', service: 'Website Dev',
      result: '2x', resultLbl: 'Monthly Enquiries',
      title: 'New Website Doubled Leads',
      desc: 'A conversion-first redesign with clear CTAs and fast load times doubled their lead volume in month one.',
    },
  ];
  return (
    <section className="sec-results">
      <div className="sec-results__glow" />
      <div className="container sec-results__inner">
        <div className="sec-results__header nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--light">Case Studies</span>
          <h2 className="sec-heading--light">
            POWERED BY DATA.<br />
            <span className="sec-red-light">DRIVEN BY RESULTS.</span>
          </h2>
          <div className="sec-rule--red" />
          <p className="sec-body--light">Real campaigns. Real businesses. Real growth.</p>
        </div>

        <div className="sec-results__grid">
          {cases.map((c, i) => (
            <div key={c.client} className="sec-result-card nh-reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="sec-result-card__head">
                <div className="sec-result-card__avatar" style={{ color: c.iconColor }}>
                  <c.Icon size={22} />
                </div>
                <div>
                  <p className="sec-result-card__client">{c.client}</p>
                  <p className="sec-result-card__service">{c.service}</p>
                </div>
              </div>
              <div className="sec-result-card__metric">
                <span className="sec-result-card__val">{c.result}</span>
                <span className="sec-result-card__lbl">{c.resultLbl}</span>
              </div>
              <h4 className="sec-result-card__title">{c.title}</h4>
              <p className="sec-result-card__desc">{c.desc}</p>
              <Link to="/contact" className="sec-result-card__cta">View Case Study →</Link>
            </div>
          ))}
        </div>

        <div className="sec-results__bottom nh-reveal">
          <Link to="/contact" className="sec-btn sec-btn--red">
            Get Results Like These →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 7 — CONFIDENCE  (dark navy #0D1B2A)
   ================================================================ */
function ConfidenceSection() {
  return (
    <section className="sec-confidence">
      <div className="sec-confidence__glow" />
      <div className="container sec-confidence__inner nh-reveal">
        <span className="sec-eyebrow sec-eyebrow--light">At MAJ Digital you will know your brand, find your audience, and be ready for whatever growth you will take.</span>

        <h2 className="sec-confidence__top-line nh-reveal nh-delay-1">
          BE CONFIDENT IN WHO
        </h2>

        <div className="sec-confidence__you-row nh-reveal nh-delay-2">
          <span className="sec-confidence__you-letter">Y</span>
          <div className="sec-confidence__you-circle">
            <FiTarget size={48} color="#ffffff" />
          </div>
          <span className="sec-confidence__you-letter">U</span>
        </div>

        <h2 className="sec-confidence__bottom-line nh-reveal nh-delay-3">
          WILL <span className="sec-red-light">BECOME.</span>
        </h2>
        <div className="sec-rule--red sec-confidence__rule nh-reveal nh-delay-3" />

        <p className="sec-body--light sec-confidence__sub nh-reveal nh-delay-4">
          Endless digital opportunities. Limitless brand potential.<br />
          We give you the strategy, the execution, and the results to<br />
          grow into exactly who you're meant to be online.
        </p>

        <div className="nh-reveal nh-delay-4">
          <Link to="/contact" className="sec-btn sec-btn--red">
            Start Your Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 8 — TESTIMONIALS  (light white)
   ================================================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rahul Sharma', role: 'CEO, TechStart India',
      text: 'MAJ Digital completely transformed our online presence. We went from page 5 to position 1 in just 6 months — and leads have never been higher.',
      rating: 5,
    },
    {
      name: 'Priya Kapoor', role: 'Founder, StyleHub',
      text: 'The Google Ads team is exceptional. Our ROAS went from 1.2x to 4.8x in three months. I only wish we had found them sooner.',
      rating: 5,
    },
    {
      name: 'David Mills', role: 'Director, GreenBuild Co.',
      text: 'New website launched, leads doubled in month one. The team delivered exactly what they promised — on time, on budget, and with full transparency.',
      rating: 5,
    },
  ];
  return (
    <section className="sec-testi">
      <div className="container sec-testi__inner">
        <div className="sec-testi__header nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--dark">Client Stories</span>
          <h2 className="sec-heading--dark">
            WHAT OUR CLIENTS<br />
            <span className="sec-red-dark">ARE SAYING.</span>
          </h2>
          <div className="sec-rule--red" />
        </div>

        <div className="sec-testi__grid">
          {testimonials.map((t, i) => (
            <div key={t.name} className="sec-testi-card nh-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="sec-testi-card__stars">
                {'★'.repeat(t.rating)}
              </div>
              <p className="sec-testi-card__text">"{t.text}"</p>
              <div className="sec-testi-card__author">
                <div className="sec-testi-card__avatar">{t.name.charAt(0)}</div>
                <div>
                  <p className="sec-testi-card__name">{t.name}</p>
                  <p className="sec-testi-card__role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 8 — CTA  (dark navy #0D1B2A)
   ================================================================ */
function CTASection() {
  return (
    <section className="sec-cta">
      <div className="sec-cta__glow-1" />
      <div className="sec-cta__glow-2" />
      <div className="container sec-cta__inner nh-reveal">
        <span className="sec-eyebrow sec-eyebrow--light">Ready to grow?</span>
        <h2 className="sec-cta__heading">
          LET'S BUILD SOMETHING<br />
          <span className="sec-red-light">REMARKABLE.</span>
        </h2>
        <div className="sec-rule--red sec-cta__rule" />
        <p className="sec-body--light sec-cta__sub">
          Free audit. No long-term lock-ins. Dedicated account manager from day one.
        </p>
        <div className="sec-cta__btns">
          <Link to="/contact" className="sec-btn sec-btn--red">Get Your Free Audit →</Link>
          <Link to="/services" className="sec-btn sec-btn--outline-light">Explore Services</Link>
        </div>
        <div className="sec-cta__trust">
          {['✓ No lock-in contracts', '✓ Monthly transparent reports', '✓ Dedicated account manager'].map((item) => (
            <span key={item} className="sec-cta__trust-item">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   HOME — Assembles all sections
   ================================================================ */
export default function Home() {
  useReveal();
  return (
    <main>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ResultsSection />
      <ConfidenceSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
