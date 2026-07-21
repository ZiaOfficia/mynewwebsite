import { useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { serviceDetails, services } from '../data/index.js';
import CTA from '../sections/CTA/CTA.jsx';
import { useBooking } from '../components/BookingModal/BookingContext.jsx';
import './Home.css';
import './ServiceDetail.css';
import {
  RiSearchLine, RiBarChartLine, RiCheckDoubleLine, RiCodeSSlashLine, RiLayoutLine,
  RiMegaphoneLine, RiRocketLine, RiBroadcastLine, RiLineChartLine, RiTrophyLine,
  RiGlobalLine, RiLightbulbLine, RiPieChartLine, RiTeamLine, RiTimeLine,
  RiMoneyDollarCircleLine, RiShieldCheckLine, RiQuestionLine,
} from 'react-icons/ri';
import { FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';
import {
  SiInstagram, SiWhatsapp, SiFacebook, SiYoutube, SiX,
  SiTiktok, SiSnapchat, SiPinterest, SiTelegram, SiThreads,
} from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

const DETAIL_ICONS = [
  { name: 'SEO',         Icon: RiSearchLine     },
  { name: 'Analytics',   Icon: RiBarChartLine   },
  { name: 'Web Dev',     Icon: RiCodeSSlashLine },
  { name: 'Design',      Icon: RiLayoutLine     },
  { name: 'Marketing',   Icon: RiMegaphoneLine  },
  { name: 'Growth',      Icon: RiRocketLine     },
  { name: 'Social',      Icon: RiBroadcastLine  },
  { name: 'Performance', Icon: RiLineChartLine  },
  { name: 'Results',     Icon: RiTrophyLine     },
  { name: 'Targeting',   Icon: FiTarget         },
  { name: 'Global',      Icon: RiGlobalLine     },
  { name: 'Strategy',    Icon: RiLightbulbLine  },
  { name: 'Insights',    Icon: RiPieChartLine   },
  { name: 'Team',        Icon: RiTeamLine       },
  { name: 'Timeline',    Icon: RiTimeLine       },
  { name: 'Trends',      Icon: FiTrendingUp     },
  { name: 'Speed',       Icon: FiZap            },
];

/* SMO uses real platform icons in their own brand colours so the page reads
   as "social media" at a glance instead of one flat accent. */
const SOCIAL_ICONS = [
  { name: 'Instagram', Icon: SiInstagram, color: '#E1306C' },
  { name: 'WhatsApp',  Icon: SiWhatsapp,  color: '#25D366' },
  { name: 'Facebook',  Icon: SiFacebook,  color: '#1877F2' },
  { name: 'YouTube',   Icon: SiYoutube,   color: '#FF0000' },
  { name: 'LinkedIn',  Icon: FaLinkedin,  color: '#0A66C2' },
  { name: 'X',         Icon: SiX,         color: '#FFFFFF' },
  { name: 'TikTok',    Icon: SiTiktok,    color: '#69C9D0' },
  { name: 'Snapchat',  Icon: SiSnapchat,  color: '#FFFC00' },
  { name: 'Pinterest', Icon: SiPinterest, color: '#E60023' },
  { name: 'Telegram',  Icon: SiTelegram,  color: '#26A5E4' },
  { name: 'Threads',   Icon: SiThreads,   color: '#F5F5F5' },
];

/* Rotated through SMO tiles/stats so each one carries a different platform's colour */
const TILE_COLORS = ['#1877F2', '#E1306C', '#25D366', '#FF0000', '#0A66C2'];

const hexToRgba = (hex, alpha) => {
  let raw = hex.replace('#', '');
  if (raw.length === 3) raw = raw[0]+raw[0]+raw[1]+raw[1]+raw[2]+raw[2];
  const r = parseInt(raw.substring(0,2),16);
  const g = parseInt(raw.substring(2,4),16);
  const b = parseInt(raw.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const { openBooking } = useBooking();
  const service = serviceDetails[slug];
  const meta    = services.find((s) => s.slug === slug);
  const themeColor = meta?.color || '#CC1F35';

  /* Google Ads gets a tri-color scheme: blue (major) + yellow + green */
  const isGoogleAds  = slug === 'google-ads';
  /* SMO gets a tri-color scheme: Facebook (major/base) + Instagram + WhatsApp — no flat pink base */
  const isSMO        = slug === 'smo';
  const accentColor  = themeColor;                                                    // primary / major
  const checkColor   = isGoogleAds ? '#34A853' : isSMO ? '#25D366' : themeColor;      // green      → check icons
  const numberColor  = isGoogleAds ? '#FBBC04' : isSMO ? '#E1306C' : themeColor;      // yellow/pink → stats / pricing numbers
  const heroIcons    = isSMO ? SOCIAL_ICONS : DETAIL_ICONS;

  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slug]);

  /* Arriving with /services/:slug#pricing → scroll to the pricing section
     once the page-transition (300ms exit + scroll reset) has finished */
  useEffect(() => {
    if (hash !== '#pricing') return;
    const id = setTimeout(() => {
      const el = document.getElementById('pricing');
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }, 550);
    return () => clearTimeout(id);
  }, [hash, slug]);

  if (!service) return <Navigate to="/services" replace />;

  const descParagraphs = (meta?.description || '').trim().split(/\n\n+/).filter(Boolean).map(p => p.trim());

  const CTA_CONTENT = {
    'web-development': {
      quote: '"A great website isn\'t built — it\'s engineered. And yours is one conversation away."',
      sub:   'Your website is your 24/7 salesperson. Let\'s build one that never stops converting.',
    },
    'landing-pages': {
      quote: '"Every click is a chance. Every landing page is your pitch. Make it impossible to leave."',
      sub:   'One high-converting page can change everything. Let\'s design yours today — free audit included.',
    },
    'seo': {
      quote: '"The best time to rank on Google was yesterday. The second best time is right now."',
      sub:   'Page 1 doesn\'t happen by accident. Let\'s build your SEO strategy and start climbing today.',
    },
    'smo': {
      quote: '"Your audience is already scrolling. Make sure what they see next is you."',
      sub:   'Turn passive followers into active buyers. One call with HiBrands is all it takes to start.',
    },
    'google-ads': {
      quote: '"Every rupee you spend either works for you or against you. Let\'s make every one count."',
      sub:   'Stop bleeding ad budget on guesswork. Our Google Ads team turns spend into measurable ROI — fast.',
    },
  };

  const ctaContent = CTA_CONTENT[slug] || {
    quote: '"Success is not a coincidence — it\'s a strategy executed with precision."',
    sub:   'Just say hi — one conversation with HiBrands unlocks your brand\'s real potential. Free audit — no lock-ins, no fluff, just results.',
  };

  return (
    <main className="service-detail-page">

      {/* ── HERO ── */}
      <section className="nh-hero sd-hero">
        <div className="nh-hero__brands" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {Array.from({ length: 90 }, (_, i) => heroIcons[i % heroIcons.length]).map((item, i) => (
            <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': item.color || themeColor }}>
              <item.Icon className="nh-hero__brand-icon" />
              <span className="nh-hero__brand-label">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="nh-hero__overlay" />

        <div className="container sd-hero__inner">
          <div className="nh-hero__center">
            <span className="sec-eyebrow sec-eyebrow--light nh-reveal">Service Detail</span>
            <h1 className="nh-hero__heading nh-reveal nh-delay-1">
              {service.title.split(' ')[0]}<br />
              <span className="nh-hero__red">{service.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <div className="nh-hero__underline nh-reveal nh-delay-2" />
            <p className="sd-hero__why nh-reveal nh-delay-3">
              {meta?.tagline}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="nh-hero__stats-bar nh-reveal nh-delay-4">
          {(service.heroStats || []).map((s, i) => (
            <div key={s.lbl} className="nh-hero__stat-item">
              <span
                className="nh-hero__stat-val"
                style={isSMO ? { '--stat-color': TILE_COLORS[i % TILE_COLORS.length] } : undefined}
              >
                {s.val}
              </span>
              <span className="nh-hero__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT IS? (Light) ── */}
      <section className="sec-about" style={{ padding: '6rem 0', background: '#F8F7F5' }}>
        <div className="container">
          <div className="sec-services__header nh-reveal" style={{ marginBottom: '3rem' }}>
            <span className="sec-eyebrow sec-eyebrow--dark">Understanding the Service</span>
            <h2 className="sec-heading--dark">
              WHAT IS <span className="sec-red-dark">{service.title.toUpperCase()}?</span>
            </h2>
            <div className="sec-rule--red" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="sd-what-grid">
            <div className="nh-reveal-left">
              {descParagraphs.map((para, i) => (
                <p key={i} style={{ color: '#4A5568', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '1.2rem' }}>
                  {para}
                </p>
              ))}
            </div>
            <div className="nh-reveal nh-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '1.3rem', color: '#0D1B2A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Key Capabilities
              </h3>
              {meta?.features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', background: '#ffffff', borderRadius: '10px', border: '1px solid #EBEBEB' }}>
                  <RiCheckDoubleLine style={{ color: checkColor, flexShrink: 0, fontSize: '1.1rem' }} />
                  <span style={{ color: '#0D1B2A', fontWeight: 600, fontSize: '0.95rem' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY IMPORTANT? (Dark) ── */}
      <section className="sec-results sd-results">
        <div className="sec-results__glow" />
        <div className="container">
          <div className="sec-services__header nh-reveal" style={{ marginBottom: '3rem' }}>
            <span className="sec-eyebrow sec-eyebrow--light">The Bigger Picture</span>
            <h2 className="sec-heading--light">
              WHY IS IT <span className="sec-red-light">IMPORTANT?</span>
            </h2>
            <div className="sec-rule--red" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="sd-why-grid">
            <div className="nh-reveal-left">
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                {service.whyNecessary}
              </p>
            </div>
            <div className="nh-reveal nh-delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {[
                { Icon: RiShieldCheckLine, label: 'Proven Results'    },
                { Icon: RiLightbulbLine,   label: 'Strategic Approach'},
                { Icon: FiTrendingUp,      label: 'Measurable Growth' },
                { Icon: RiGlobalLine,      label: 'Long-term Impact'  },
              ].map(({ Icon, label }, i) => {
                const tileColor = isSMO ? TILE_COLORS[i % TILE_COLORS.length] : accentColor;
                return (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${hexToRgba(tileColor, 0.25)}`, borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', textAlign: 'center' }}>
                    <Icon style={{ color: tileColor, fontSize: '2rem' }} />
                    <span style={{ color: '#ffffff', fontFamily: 'var(--font-display-cond)', fontSize: '0.95rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WILL HELP YOU (Light) ── */}
      <section className="sec-about" style={{ padding: '6rem 0', background: '#ffffff' }}>
        <div className="container">
          <div className="sec-services__header nh-reveal" style={{ marginBottom: '3rem' }}>
            <span className="sec-eyebrow sec-eyebrow--dark">Real-World Impact</span>
            <h2 className="sec-heading--dark">
              HOW IT WILL <span className="sec-red-dark">HELP YOU.</span>
            </h2>
            <div className="sec-rule--red" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="sd-help-grid">
            <div className="nh-reveal-left">
              <div style={{ background: '#F8F7F5', borderRadius: '16px', padding: '2rem', borderLeft: `4px solid ${accentColor}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <RiSearchLine style={{ color: accentColor, fontSize: '1.4rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: '1.2rem', color: '#0D1B2A', textTransform: 'uppercase' }}>The Solution</h3>
                </div>
                <p style={{ color: '#4A5568', lineHeight: 1.8, fontSize: '1rem' }}>{service.howItHelped}</p>
              </div>
            </div>
            <div className="nh-reveal nh-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Attracts the right audience at the right time',
                'Converts visitors into paying customers',
                'Builds long-term brand authority and trust',
                'Delivers measurable, trackable ROI',
                'Frees your team to focus on core business',
                'Compounds over time — growing without extra spend',
              ].map((point) => (
                <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <RiCheckDoubleLine style={{ color: checkColor, flexShrink: 0, marginTop: '3px', fontSize: '1.1rem' }} />
                  <span style={{ color: '#4A5568', fontSize: '1rem', lineHeight: 1.6 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVENUE YOU CAN GENERATE (Dark accent) ── */}
      <section style={{ background: '#060c15', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${hexToRgba(themeColor, 0.12)} 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sec-services__header nh-reveal" style={{ marginBottom: '3rem' }}>
            <span className="sec-eyebrow sec-eyebrow--light">The Numbers</span>
            <h2 className="sec-heading--light">
              REVENUE YOU CAN <span className="sec-red-light">GENERATE.</span>
            </h2>
            <div className="sec-rule--red" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="sd-rev-grid">
            <div className="nh-reveal-left" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${hexToRgba(accentColor, 0.3)}`, borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
              <RiMoneyDollarCircleLine style={{ color: numberColor, fontSize: '3.5rem', marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-display-cond)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                Real Growth
              </h3>
              <p style={{ color: numberColor, fontFamily: 'var(--font-display-cond)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Measured. Transparent. Yours.
              </p>
            </div>
            <div className="nh-reveal nh-delay-1">
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.9, fontSize: '1.1rem', marginBottom: '2rem' }}>
                {service.revenue}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {(service.heroStats || []).map((s) => (
                  <div key={s.lbl} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: `1px solid ${hexToRgba(accentColor, 0.15)}` }}>
                    <div style={{ fontFamily: 'var(--font-display-cond)', fontSize: '2rem', fontWeight: 900, color: numberColor, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="sec-pricing-sd" id="pricing">
        <div className="container">
          <div className="sec-services__header nh-reveal" style={{ marginBottom: '3rem' }}>
            <span className="sec-eyebrow sec-eyebrow--dark">Pricing Plans</span>
            <h2 className="sec-heading--dark">
              FLEXIBLE <span className="sec-red-dark">LEVELS.</span>
            </h2>
            <div className="sec-rule--red" />
            <p className="sec-body--dark" style={{ maxWidth: 600, textAlign: 'center' }}>
              Choose the level of execution that fits your current business scale. Upgrade anytime as you grow.
            </p>
          </div>

          <div className="sd-pricing-grid">
            {service.packages.map((pkg, i) => (
              <div
                key={i}
                className={`sd-pricing-card nh-reveal ${pkg.popular ? 'sd-pricing-card--popular' : ''}`}
                style={isSMO
                  ? { transitionDelay: `${i * 0.15}s`, '--pkg-color': TILE_COLORS[i % TILE_COLORS.length] }
                  : { transitionDelay: `${i * 0.15}s` }}
              >
                {pkg.popular && <div className="sd-pricing-badge">Most Popular</div>}
                <div className="sd-pricing-top">
                  <h3 className="sd-pricing-name">{pkg.name}</h3>
                  <div className="sd-pricing-price">
                    {pkg.oldPrice && <span className="sd-price-old">{pkg.oldPrice}</span>}
                    <span className="sd-price-val">{pkg.price}</span>
                    <span className="sd-price-period">{pkg.period}</span>
                  </div>
                  <p className="sd-pricing-tagline">{pkg.tagline}</p>
                </div>
                <ul className="sd-pricing-features">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="sd-pricing-feature">
                      <RiCheckDoubleLine className="sd-feature-icon" style={{ color: checkColor }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="sd-pricing-bottom">
                  <button onClick={openBooking} className={`sec-btn ${pkg.popular ? 'sec-btn--red' : 'sec-btn--outline-dark'}`}>
                    {pkg.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA color={themeColor} quote={ctaContent.quote} sub={ctaContent.sub} />

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .sd-what-grid, .sd-why-grid, .sd-help-grid, .sd-rev-grid { grid-template-columns: 1fr !important; }
        }
        /* ── Hero overlay: edge vignette, not center blob ── */
        .service-detail-page .nh-hero__overlay {
          background: linear-gradient(180deg,
            rgba(6,12,21,0.82) 0%,
            rgba(6,12,21,0.18) 20%,
            rgba(6,12,21,0.10) 50%,
            rgba(6,12,21,0.18) 80%,
            rgba(6,12,21,0.72) 100%
          ) !important;
        }
        .service-detail-page .nh-hero__heading {
          text-shadow: 0 2px 32px rgba(6,12,21,0.85), 0 0 8px rgba(6,12,21,0.6) !important;
        }
        /* ── Dynamic Service Theme ── */
        .service-detail-page .sec-results__glow { background: radial-gradient(circle, ${hexToRgba(themeColor, 0.15)} 0%, transparent 70%) !important; }
        .service-detail-page .nh-hero__red,
        .service-detail-page .sec-red-light,
        .service-detail-page .sec-red-dark { color: ${themeColor} !important; }
        .service-detail-page .nh-hero__stat-val { color: ${themeColor} !important; text-shadow: 0 0 24px ${hexToRgba(themeColor, 0.45)} !important; }
        .service-detail-page .nh-hero__underline { background: ${themeColor} !important; }
        .service-detail-page .sec-rule--red { background: ${themeColor} !important; }
        .service-detail-page .sec-btn--red { background: ${themeColor} !important; border-color: ${themeColor} !important; }
        .service-detail-page .sec-btn--red:hover { opacity: 0.85; }
        .service-detail-page .sd-pricing-badge { background: ${themeColor} !important; }
        .service-detail-page .sd-pricing-name,
        .service-detail-page .sd-price-val { color: ${themeColor} !important; }
        .service-detail-page .sd-feature-icon { color: ${themeColor} !important; }
        .service-detail-page .sd-pricing-card--popular { border-color: ${themeColor} !important; box-shadow: 0 0 30px ${hexToRgba(themeColor, 0.2)} !important; }

        ${slug === 'google-ads' ? `
        /* ── Google Ads: Blue (major) + Yellow + Green tri-color scheme ── */

        /* Hero glow: blue + yellow split */
        .service-detail-page .nh-hero__glow--1 { background: radial-gradient(circle, rgba(26,115,232,0.32) 0%, transparent 70%) !important; }
        .service-detail-page .nh-hero__glow--2 { background: radial-gradient(circle, rgba(251,188,4,0.18) 0%, transparent 70%) !important; }

        /* Headline "WE GROW" accent stays blue */
        .service-detail-page .nh-hero__red { color: #1A73E8 !important; }
        .service-detail-page .nh-hero__underline { background: linear-gradient(90deg, #1A73E8 0%, #FBBC04 50%, #34A853 100%) !important; }

        /* Stat numbers: yellow */
        .service-detail-page .nh-hero__stat-val { color: #FBBC04 !important; text-shadow: 0 0 24px rgba(251,188,4,0.45) !important; }

        /* Section rules: blue */
        .service-detail-page .sec-rule--red { background: #1A73E8 !important; }

        /* Red text accents: blue */
        .service-detail-page .sec-red-light,
        .service-detail-page .sec-red-dark { color: #1A73E8 !important; }

        /* Feature check icons: green */
        .service-detail-page .sd-feature-icon { color: #34A853 !important; }

        /* Pricing: yellow for name/price, green badge */
        .service-detail-page .sd-pricing-name { color: #FBBC04 !important; }
        .service-detail-page .sd-price-val { color: #1A73E8 !important; }
        .service-detail-page .sd-pricing-badge { background: #34A853 !important; }
        .service-detail-page .sd-pricing-card--popular {
          border-color: #1A73E8 !important;
          box-shadow: 0 0 30px rgba(26,115,232,0.22), 0 0 60px rgba(251,188,4,0.08) !important;
        }

        /* CTA button: blue */
        .service-detail-page .sec-btn--red { background: #1A73E8 !important; border-color: #1A73E8 !important; }
        .service-detail-page .sec-btn--red:hover { background: #1557B0 !important; border-color: #1557B0 !important; }

        /* Results glow: blue */
        .service-detail-page .sec-results__glow { background: radial-gradient(circle, rgba(26,115,232,0.14) 0%, transparent 70%) !important; }
        ` : ''}

        ${isSMO ? `
        /* ── SMO: no single flat "base" colour — Facebook (major) + Instagram + WhatsApp, blended ── */

        /* Hero glow: Facebook + Instagram split */
        .service-detail-page .nh-hero__glow--1 { background: radial-gradient(circle, rgba(24,119,242,0.30) 0%, transparent 70%) !important; }
        .service-detail-page .nh-hero__glow--2 { background: radial-gradient(circle, rgba(225,48,108,0.20) 0%, transparent 70%) !important; }

        /* Headline accent: brightened tri-platform gradient, fully opaque.
           drop-shadow (not text-shadow) is used because background-clip:text
           glyphs are painted, so text-shadow would render behind nothing. */
        .service-detail-page .nh-hero__red {
          background: linear-gradient(90deg, #4A9BFF 0%, #FF4D8D 52%, #3DEB7F 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
          opacity: 1 !important;
          text-shadow: none !important;
          filter:
            drop-shadow(0 2px 10px rgba(6,12,21,0.95))
            drop-shadow(0 0 26px rgba(255,77,141,0.35)) !important;
        }
        .service-detail-page .nh-hero__underline { background: linear-gradient(90deg, #1877F2 0%, #E1306C 50%, #25D366 100%) !important; }

        /* Stat numbers: each one takes a different platform colour (set inline per stat) */
        .service-detail-page .nh-hero__stat-val {
          color: var(--stat-color, #E1306C) !important;
          text-shadow: 0 0 24px color-mix(in srgb, var(--stat-color, #E1306C) 45%, transparent) !important;
        }

        /* Section rules: Facebook blue */
        .service-detail-page .sec-rule--red { background: #1877F2 !important; }

        /* Red text accents: Facebook blue */
        .service-detail-page .sec-red-light,
        .service-detail-page .sec-red-dark { color: #1877F2 !important; }

        /* Feature check icons: WhatsApp green */
        .service-detail-page .sd-feature-icon { color: #25D366 !important; }

        /* Pricing: each card carries a different platform colour (set inline per card) */
        .service-detail-page .sd-pricing-name { color: var(--pkg-color, #E1306C) !important; }
        .service-detail-page .sd-price-val { color: var(--pkg-color, #1877F2) !important; }
        .service-detail-page .sd-pricing-badge { background: #25D366 !important; }
        .service-detail-page .sd-pricing-card--popular {
          border-image: linear-gradient(90deg, #1877F2, #E1306C, #25D366) 1 !important;
          box-shadow: 0 0 30px rgba(24,119,242,0.2), 0 0 60px rgba(225,48,108,0.12), 0 0 60px rgba(37,211,102,0.08) !important;
        }

        /* CTA button: gradient across all three, not flat */
        .service-detail-page .sec-btn--red { background: linear-gradient(90deg, #1877F2 0%, #E1306C 55%, #25D366 100%) !important; border-color: transparent !important; }
        .service-detail-page .sec-btn--red:hover { filter: brightness(0.88); }

        /* Results glow: blended */
        .service-detail-page .sec-results__glow {
          background:
            radial-gradient(circle at 35% 50%, rgba(24,119,242,0.14) 0%, transparent 60%),
            radial-gradient(circle at 65% 50%, rgba(225,48,108,0.12) 0%, transparent 60%) !important;
        }
        ` : ''}
      `}} />
    </main>
  );
}
