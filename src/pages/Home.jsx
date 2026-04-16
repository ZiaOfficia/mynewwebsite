/* ================================================================
   HOME PAGE — Squareit Solutions
   Berkeley Carroll-inspired story-driven layout
   ================================================================ */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import './Home.css';

/* ── Intersection Observer hook for scroll reveals ─────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ================================================================
   SECTION 1 — HERO (Three.js particle network)
   ================================================================ */
function HeroSection() {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 200);
    camera.position.z = 4.5;

    /* ── Particles ── */
    const COUNT = 110;
    const positions = new Float32Array(COUNT * 3);
    const vels = [];
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      vels.push({
        x: (Math.random() - 0.5) * 0.0028,
        y: (Math.random() - 0.5) * 0.0020,
        z: (Math.random() - 0.5) * 0.0015,
      });
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const ptMat = new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.045, transparent: true, opacity: 0.85 });
    const pts = new THREE.Points(ptGeo, ptMat);
    scene.add(pts);

    /* ── Lines between nearby particles ── */
    const lineMat = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.06 });
    let lineGeo = new THREE.BufferGeometry();
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegs);

    /* ── Red accent orbs ── */
    const orbGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xCC1F35, transparent: true, opacity: 0.7 });
    const ORB_COUNT = 18;
    const orbMeshes = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      const m = new THREE.Mesh(orbGeo, orbMat.clone());
      m.position.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      m.userData.vel = {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.002,
      };
      scene.add(m);
      orbMeshes.push(m);
    }

    const THRESHOLD = 2.0;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const pos = ptGeo.attributes.position.array;

      /* Update particle positions */
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += vels[i].x;
        pos[i * 3 + 1] += vels[i].y;
        pos[i * 3 + 2] += vels[i].z;
        if (Math.abs(pos[i * 3])     > 5)   vels[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 3.2) vels[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 2.5) vels[i].z *= -1;
      }
      ptGeo.attributes.position.needsUpdate = true;

      /* Rebuild line segments */
      const lp = [];
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pos[i*3] - pos[j*3];
          const dy = pos[i*3+1] - pos[j*3+1];
          const dz = pos[i*3+2] - pos[j*3+2];
          if (dx*dx + dy*dy + dz*dz < THRESHOLD * THRESHOLD) {
            lp.push(pos[i*3], pos[i*3+1], pos[i*3+2], pos[j*3], pos[j*3+1], pos[j*3+2]);
          }
        }
      }
      lineSegs.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));

      /* Update orbs */
      orbMeshes.forEach((m) => {
        m.position.x += m.userData.vel.x;
        m.position.y += m.userData.vel.y;
        if (Math.abs(m.position.x) > 5)   m.userData.vel.x *= -1;
        if (Math.abs(m.position.y) > 3.2) m.userData.vel.y *= -1;
      });

      /* Slow camera drift */
      camera.position.x = Math.sin(Date.now() * 0.0001) * 0.4;
      camera.position.y = Math.cos(Date.now() * 0.00008) * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="nh-hero">
      <canvas ref={canvasRef} className="nh-hero__canvas" />
      <div className="nh-hero__overlay" />

      <div className="container nh-hero__content">
        <p className="nh-hero__eyebrow nh-reveal">Welcome to Squareit Solutions</p>

        <h1 className="nh-hero__heading nh-reveal nh-delay-1">
          WE BUILD.<br />
          WE RANK.<br />
          <span className="nh-hero__red">WE GROW.</span>
        </h1>

        <div className="nh-hero__underline nh-reveal nh-delay-2" />

        <p className="nh-hero__sub nh-reveal nh-delay-2">
          Your brand. Your audience. Your digital future.
          We make it all happen — measurably.
        </p>

        <div className="nh-hero__ctas nh-reveal nh-delay-3">
          <Link to="/contact" className="nh-btn nh-btn--primary">
            Get a Free Audit
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/services" className="nh-btn nh-btn--outline">Our Services</Link>
        </div>

        <div className="nh-hero__stats nh-reveal nh-delay-4">
          {[
            { val: '150+', lbl: 'Brands Grown' },
            { val: '95%',  lbl: 'Client Retention' },
            { val: '3.5x', lbl: 'Average ROI' },
            { val: '20+',  lbl: 'Team Members' },
          ].map((s) => (
            <div key={s.lbl} className="nh-hero__stat">
              <span className="nh-hero__stat-val">{s.val}</span>
              <span className="nh-hero__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nh-hero__scroll">
        <div className="nh-hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 2 — IMPACT STATEMENT (Cream)
   ================================================================ */
function ImpactSection() {
  return (
    <section className="nh-impact">
      <div className="container nh-impact__inner">
        <div className="nh-impact__slide-row">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className={`nh-impact__dot${i===2?' nh-impact__dot--active':''}`} />
          ))}
        </div>

        <h2 className="nh-impact__heading nh-reveal">
          THE PROFOUND IMPACT OF<br />
          DIGITAL MARKETING THAT<br />
          <em>GROWS WITH YOU.</em>
        </h2>

        <div className="nh-impact__grid">
          <div className="nh-impact__copy nh-reveal-left">
            <p className="nh-impact__label">Who We Are</p>
            <h3 className="nh-impact__sub-heading">
              A growth partner<br />built for your brand.
            </h3>
            <p className="nh-impact__text">
              Squareit Solutions accepts and amplifies your brand for who you are and
              who you want to become. Here, you will know what's working — before
              you're told what should work. You will find which channels you excel in,
              which campaigns you love, and which way your brand will grow.
            </p>
            <p className="nh-impact__text">
              From stunning websites to Google page-1 rankings and high-ROI ad
              campaigns — every service is engineered to deliver real, measurable
              business impact.
            </p>
            <Link to="/about" className="nh-impact__link">
              Our Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="nh-impact__card-wrap nh-reveal nh-delay-2">
            <div className="nh-impact__card">
              <div className="nh-impact__card-img">🚀</div>
              <div className="nh-impact__card-footer">
                <span className="nh-impact__card-label">Your Growth Partner</span>
                <span className="nh-impact__card-badge">Results-Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 3 — FULL BLEED STATS BAND
   ================================================================ */
function StatsBleedSection() {
  return (
    <section className="nh-fullbleed">
      <div className="nh-fullbleed__img">
        <p className="nh-fullbleed__tagline">
          SQUAREIT SOLUTIONS — DIGITAL GROWTH AGENCY
        </p>
      </div>
      <div className="nh-fullbleed__stats-bar">
        {[
          { val: '150+', lbl: 'Projects Delivered' },
          { val: '95%',  lbl: 'Client Retention' },
          { val: '3.5x', lbl: 'Average ROI' },
          { val: '8+',   lbl: 'Years Experience' },
        ].map((s) => (
          <div key={s.lbl} className="nh-fullbleed__stat">
            <span className="nh-fullbleed__stat-val">{s.val}</span>
            <span className="nh-fullbleed__stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 4 — PURPLE CIRCLE REVEAL
   ================================================================ */
function PurpleRevealSection() {
  return (
    <section className="nh-reveal-sec">
      {/* Left: image + circle */}
      <div className="nh-reveal-sec__img-side">
        <div className="nh-reveal-sec__img-placeholder">📊</div>
        <div className="nh-reveal-sec__circle">
          <span className="nh-reveal-sec__circle-text">YOUR D…</span>
        </div>
      </div>

      {/* Right: purple text */}
      <div className="nh-reveal-sec__text-side">
        <p className="nh-reveal-sec__eyebrow nh-reveal">This is an agency that delivers for all of you.</p>
        <div className="nh-reveal-sec__lines nh-reveal nh-delay-1">
          <span className="nh-reveal-sec__line">YOUR WEBSITE.</span>
          <span className="nh-reveal-sec__line">YOUR RANKINGS.</span>
          <span className="nh-reveal-sec__line">YOUR GROWTH.</span>
        </div>
        <p className="nh-reveal-sec__desc nh-reveal nh-delay-2">
          No matter your industry, you come to Squareit Solutions as a brand full of
          potential. Here you will find what works, where you excel, and which digital
          channels will take you further than you imagined.
        </p>
        <div className="nh-reveal nh-delay-3">
          <Link to="/contact" className="nh-btn nh-btn--outline">
            Start Growing
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 5 — YOUR WORLD (Purple full)
   ================================================================ */
function YourWorldSection() {
  return (
    <section className="nh-found" style={{ padding: '6rem 0' }}>
      <div className="nh-found__circles">
        <div className="nh-found__ring nh-found__ring--1" />
        <div className="nh-found__ring nh-found__ring--2" />
        <div className="nh-found__ring nh-found__ring--3" />
      </div>
      <div className="container nh-found__inner">
        <p style={{
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
          marginBottom: '2rem',
        }}>
          This is an agency that reflects all of you.
        </p>

        <div className="nh-reveal" style={{ marginBottom: '1rem' }}>
          <h2 className="nh-cond nh-cond-lg" style={{ color: 'var(--white)', textAlign: 'center', lineHeight: 1 }}>
            YOUR WEBSITE.
          </h2>
          <h2 className="nh-cond nh-cond-lg" style={{ color: 'var(--white)', textAlign: 'center', lineHeight: 1 }}>
            YOUR NEIGHBOURHOOD.
          </h2>
          <h2 className="nh-cond nh-cond-lg" style={{ color: 'var(--white)', textAlign: 'center', lineHeight: 1 }}>
            YOUR BRAND.
          </h2>
        </div>

        {/* Globe/icon */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.55 }}>
            <circle cx="40" cy="40" r="38" stroke="#D4F742" strokeWidth="2"/>
            <ellipse cx="40" cy="40" rx="20" ry="38" stroke="#D4F742" strokeWidth="2"/>
            <line x1="2" y1="40" x2="78" y2="40" stroke="#D4F742" strokeWidth="2"/>
            <line x1="2" y1="26" x2="78" y2="26" stroke="#D4F742" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="2" y1="54" x2="78" y2="54" stroke="#D4F742" strokeWidth="1" strokeDasharray="4 4"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 6 — BE FOUND EVERYWHERE (Purple + concentric rings)
   ================================================================ */
function BeFoundSection() {
  return (
    <section className="nh-found" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="nh-found__circles">
        <div className="nh-found__ring nh-found__ring--1" />
        <div className="nh-found__ring nh-found__ring--2" />
        <div className="nh-found__ring nh-found__ring--3" />
      </div>
      <div className="container nh-found__inner">
        <div className="nh-found__slide-dots">
          {[1,2,3,4].map((i) => (
            <div key={i} className={`nh-found__slide-dot${i===2?' nh-found__slide-dot--active':''}`} />
          ))}
        </div>
        <h2 className="nh-found__heading nh-reveal">
          BE FOUND<br />EVERYWHERE<br />
          <span style={{ color: 'var(--lime)' }}>ONLINE.</span>
        </h2>
        <div className="nh-found__underline nh-reveal nh-delay-1" />
        <p className="nh-found__sub nh-reveal nh-delay-2">
          No matter your age or stage, you come to Squareit Solutions as a brand full
          of complexity and possibility. Within our strategies are many paths, all in
          service to you. Do what generates leads, explore what converts, and feel
          confident in your digital growth.
        </p>
        <div className="nh-reveal nh-delay-3">
          <Link to="/services" className="nh-btn nh-btn--outline">
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 7 — BE FOUND with service cards (Purple)
   ================================================================ */
function ServicesCardsSection() {
  const cards = [
    { icon: '🔍', title: 'SEO',                 desc: 'Rank on page 1 and stay there with our proven organic strategy.',        href: '/services/seo' },
    { icon: '📣', title: 'Social Media (SMO)',   desc: 'Build your community and turn followers into loyal customers.',          href: '/services/smo' },
    { icon: '📈', title: 'Google Ads',           desc: 'High-ROI paid campaigns with full transparency on every rupee spent.',  href: '/services/google-ads' },
    { icon: '🖥️', title: 'Website Development',  desc: 'Fast, conversion-optimised websites built to rank and perform.',        href: '/services/web-development' },
    { icon: '🎯', title: 'Landing Pages',        desc: 'Purpose-built pages that turn ad clicks into real enquiries.',          href: '/services/landing-pages' },
  ];
  return (
    <section className="nh-found-card">
      <div className="container nh-found-card__inner">
        <div className="nh-found-card__text">
          <h2 className="nh-found__heading nh-cond nh-reveal" style={{ textAlign: 'left', fontSize: 'clamp(2.5rem,5vw,5rem)', color:'var(--white)' }}>
            BE FOUND.<br />
            BE SEEN.<br />
            <span style={{ color: 'var(--lime)' }}>BE CHOSEN.</span>
          </h2>
          <div className="nh-found__underline nh-reveal nh-delay-1" style={{ margin: '1.5rem 0' }} />
          <p className="nh-found__sub nh-reveal nh-delay-2" style={{ margin: '0 0 2rem 0', maxWidth: '100%' }}>
            Five services. One mission. To make your brand impossible to ignore online.
          </p>
          <div className="nh-reveal nh-delay-3">
            <Link to="/services" className="nh-btn nh-btn--outline">
              View All Services
            </Link>
          </div>
        </div>

        <div className="nh-found-card__cards nh-reveal nh-delay-1">
          {cards.map((c, i) => (
            <Link key={c.title} to={c.href} className="nh-service-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="nh-service-card__icon">{c.icon}</div>
              <div className="nh-service-card__content">
                <p className="nh-service-card__title">{c.title}</p>
                <p className="nh-service-card__desc">{c.desc}</p>
              </div>
              <span className="nh-service-card__arrow">›</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 8 — WHAT DIGITAL GROWTH LOOKS LIKE HERE (Cream)
   ================================================================ */
function ServicesDetailSection() {
  const rows = [
    {
      icon: '🖥️', title: 'Website Development',
      tag: 'Be Built & Convert',
      desc: 'Custom websites built for performance — mobile-first, SEO-ready and designed to generate leads from day one.',
      href: '/services/web-development',
    },
    {
      icon: '🔍', title: 'Search Engine Optimisation',
      tag: 'Rank & Stay There',
      desc: 'From technical audits to content strategy and link building — we get you to page 1 and keep you there.',
      href: '/services/seo',
    },
    {
      icon: '📣', title: 'SMO & Google Ads',
      tag: 'Be Seen & Heard',
      desc: 'Social media growth + high-ROI paid campaigns working together to dominate your market online.',
      href: '/services',
    },
  ];
  return (
    <section className="nh-services-sec">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="nh-services-sec__slide-row">
          {[1,2,3,4].map((i) => (
            <div key={i} className={`nh-services-sec__dot${i===1?' nh-services-sec__dot--active':''}`} />
          ))}
        </div>
        <h2 className="nh-services-sec__heading nh-reveal">
          WHAT DIGITAL GROWTH<br />
          <em>LOOKS LIKE HERE.</em>
        </h2>

        <div className="nh-services-sec__grid">
          <div className="nh-services-sec__visual nh-reveal-left">
            <div className="nh-services-sec__img">📱</div>
            <div className="nh-services-sec__badge">
              <span className="nh-services-sec__badge-val">95%</span>
              <p className="nh-services-sec__badge-lbl">Client Retention</p>
            </div>
          </div>

          <div className="nh-services-sec__list">
            {rows.map((r, i) => (
              <Link key={r.title} to={r.href} className="nh-service-row nh-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="nh-service-row__top">
                  <div className="nh-service-row__icon-title">
                    <span className="nh-service-row__icon">{r.icon}</span>
                    <span className="nh-service-row__title">{r.title}</span>
                  </div>
                  <span className="nh-service-row__tag">{r.tag}</span>
                  <span className="nh-service-row__arrow">›</span>
                </div>
                <p className="nh-service-row__desc">{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 9 — RESULTS CARDS (like educator spotlights)
   ================================================================ */
function ResultsCardsSection() {
  const cards = [
    {
      emoji: '🏢',
      client: 'TechStart India',
      service: 'SEO',
      result: '+312%',
      resultLbl: 'Organic Traffic',
      title: 'From Page 5 to Position 1',
      desc: 'Technical SEO + content strategy took TechStart from invisible to dominating their niche in 6 months.',
    },
    {
      emoji: '👗',
      client: 'StyleHub',
      service: 'Google Ads',
      result: '4.8x',
      resultLbl: 'ROAS Achieved',
      title: 'Google Ads ROAS Transformed',
      desc: 'A full account rebuild and creative refresh took their ROAS from 1.2x to 4.8x in just 3 months.',
    },
    {
      emoji: '🏗️',
      client: 'GreenBuild Co.',
      service: 'Website Dev',
      result: '2x',
      resultLbl: 'Monthly Enquiries',
      title: 'New Website Doubled Leads',
      desc: 'A conversion-first redesign with clear CTAs and fast load times doubled their lead volume in month one.',
    },
  ];
  return (
    <section className="nh-results">
      <div className="container">
        <div className="nh-results__header">
          <h2 className="nh-results__heading nh-reveal">
            POWERED BY DATA.<br />
            <span style={{ color: 'var(--red-accent)' }}>DRIVEN BY RESULTS.</span>
          </h2>
          <p className="nh-results__sub nh-reveal nh-delay-1">
            Real campaigns. Real businesses. Real growth.
          </p>
        </div>

        <div className="nh-results__cards">
          {cards.map((c, i) => (
            <div key={c.client} className="nh-result-card nh-reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="nh-result-card__top">
                <div className="nh-result-card__avatar">{c.emoji}</div>
                <div>
                  <p className="nh-result-card__client">{c.client}</p>
                  <p className="nh-result-card__service">{c.service}</p>
                </div>
              </div>
              <div className="nh-result-card__result">
                {c.result}
                <div className="nh-result-card__result-lbl">{c.resultLbl}</div>
              </div>
              <div className="nh-result-card__body">
                <p className="nh-result-card__title">{c.title}</p>
                <p className="nh-result-card__desc">{c.desc}</p>
                <Link to="/contact" className="nh-result-card__cta">→</Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }} className="nh-reveal">
          <Link to="/contact" className="nh-btn nh-btn--maroon">
            Get Results Like These
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 10 — BE CONFIDENT IN YOUR BRAND (Dark Navy, big YOU)
   ================================================================ */
function ConfidenceSection() {
  return (
    <section className="nh-confidence">
      <div className="container nh-confidence__inner">
        <div className="nh-confidence__slide-dots">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className={`nh-confidence__slide-dot${i===3?' nh-confidence__slide-dot--active':''}`} />
          ))}
        </div>
        <p className="nh-confidence__eyebrow nh-reveal">At Squareit Solutions you will know your brand, find your audience, and get ready for whatever growth you will take.</p>

        <h2 className="nh-confidence__top-line nh-reveal nh-delay-1">
          BE CONFIDENT IN WHO
        </h2>

        <div className="nh-confidence__you-row nh-reveal nh-delay-2">
          <span className="nh-confidence__you-letter">Y</span>
          <div className="nh-confidence__you-circle">🎯</div>
          <span className="nh-confidence__you-letter">U</span>
        </div>

        <h2 className="nh-confidence__bottom-line nh-reveal nh-delay-3">
          WILL <span style={{ color: 'var(--red-accent)' }}>BECOME.</span>
        </h2>
        <div className="nh-confidence__underline nh-reveal nh-delay-3" />
        <p className="nh-confidence__sub nh-reveal nh-delay-4">
          Endless digital opportunities. Limitless brand potential.
          We give you the strategy, the execution, and the results to
          grow into exactly who you're meant to be online.
        </p>
        <div className="nh-reveal nh-delay-4">
          <Link to="/contact" className="nh-btn nh-btn--primary">
            Start Your Journey
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 11 — MOSAIC GRID (Scattered service tiles)
   ================================================================ */
function MosaicSection() {
  const tiles = [
    {
      type: 'colored',
      bg: 'linear-gradient(135deg, #A2D73A 0%, #D4F742 100%)',
      color: '#1A3A00',
      label: 'SEO Experts',
      icon: null,
    },
    {
      type: 'img',
      bg: 'linear-gradient(135deg, var(--navy) 0%, var(--purple-dark) 100%)',
      emoji: '📊',
      label: 'Google Ads Pros',
      style: { transform: 'rotate(-1deg)' },
    },
    {
      type: 'circle',
      bg: 'linear-gradient(135deg, var(--maroon) 0%, var(--red-accent) 100%)',
      emoji: '🌐',
      label: 'Web Builders',
    },
    {
      type: 'img',
      bg: 'linear-gradient(135deg, var(--purple) 0%, #5B2D8C 100%)',
      emoji: '📱',
      label: 'Social Media Managers',
      style: { transform: 'rotate(1.5deg)' },
    },
    {
      type: 'colored',
      bg: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      color: 'var(--white)',
      label: 'Landing Page Designers',
      icon: null,
    },
    {
      type: 'img',
      bg: 'linear-gradient(135deg, #059669 0%, var(--navy) 100%)',
      emoji: '✍️',
      label: 'Content Creators',
      style: { transform: 'rotate(-1.5deg)' },
    },
  ];

  return (
    <section className="nh-mosaic">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="nh-mosaic__heading nh-reveal">
          LEARN FROM SQUAREIT'S<br />
          <em>PASSIONATE SPECIALISTS.</em>
        </h2>
        <div className="nh-mosaic__grid">
          {tiles.map((t, i) => {
            if (t.type === 'colored') return (
              <div
                key={i}
                className={`nh-mosaic__tile nh-mosaic__tile--colored nh-reveal`}
                style={{ background: t.bg, transitionDelay: `${i * 0.08}s`, position: 'relative' }}
              >
                <span style={{ fontSize: '2rem', opacity: 0.4 }}>⭐</span>
                <p className="nh-mosaic__tile-colored-label" style={{ color: t.color }}>{t.label}</p>
                <button className="nh-mosaic__tile-btn" style={{ background: t.color === 'var(--white)' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.15)', borderColor: 'transparent', color: t.color === 'var(--white)' ? '#000' : t.color }}>
                  +
                </button>
              </div>
            );
            if (t.type === 'circle') return (
              <div
                key={i}
                className="nh-mosaic__tile nh-mosaic__tile--img nh-reveal"
                style={{ borderRadius: '50%', aspectRatio: '1/1', transitionDelay: `${i * 0.08}s` }}
              >
                <div className="nh-mosaic__tile-img-bg" style={{ background: t.bg, borderRadius: '50%' }}>
                  <span style={{ fontSize: '3rem' }}>{t.emoji}</span>
                </div>
                <div className="nh-mosaic__tile-overlay" style={{ borderRadius: '0 0 50% 50%' }}>
                  <p className="nh-mosaic__tile-label">{t.label}</p>
                </div>
              </div>
            );
            return (
              <div
                key={i}
                className="nh-mosaic__tile nh-mosaic__tile--img nh-reveal"
                style={{ transitionDelay: `${i * 0.08}s`, ...(t.style || {}) }}
              >
                <div className="nh-mosaic__tile-img-bg" style={{ background: t.bg }}>
                  <span style={{ fontSize: '4rem' }}>{t.emoji}</span>
                </div>
                <div className="nh-mosaic__tile-overlay">
                  <p className="nh-mosaic__tile-label">{t.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 12 — MARQUEE TICKER
   ================================================================ */
function MarqueeSection() {
  const items = [
    'RESULTS', 'ROI', 'RANKINGS', 'GROWTH', 'LEADS',
    'BRANDS', 'REVENUE', 'TRAFFIC', 'CONVERSIONS', 'SUCCESS',
  ];
  const doubled = [...items, ...items];
  return (
    <div className="nh-marquee">
      <div className="nh-marquee__track">
        {doubled.map((txt, i) => (
          <span key={i} className="nh-marquee__item">
            <span className="nh-marquee__text">{txt}</span>
            <span className="nh-marquee__sep">◆</span>
          </span>
        ))}
      </div>
    </div>
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
      <ImpactSection />
      <StatsBleedSection />
      <PurpleRevealSection />
      <YourWorldSection />
      <BeFoundSection />
      <ServicesCardsSection />
      <ServicesDetailSection />
      <ResultsCardsSection />
      <ConfidenceSection />
      <MosaicSection />
      <MarqueeSection />
    </main>
  );
}
