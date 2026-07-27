'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  SiGoogle, SiMeta, SiShopify, SiHubspot, SiStripe, SiFigma, SiNotion,
  SiTiktok, SiYoutube, SiFramer, SiSpotify, SiWebflow, SiPinterest,
  SiMailchimp, SiWoocommerce, SiNetflix, SiAirbnb, SiPaypal, SiZapier,
  SiWordpress, SiReact, SiNextdotjs, SiTailwindcss, SiDiscord,
} from 'react-icons/si';
import { FaSalesforce, FaSlack } from 'react-icons/fa';
import { RiCheckLine, RiArrowRightLine } from 'react-icons/ri';
import { heroStats } from '../lib/data';

/* Same brand-grid hero as the main HiBrands site: a dimmed icon grid that
   lights up in a wave on load, with a radial overlay keeping the centred
   headline crisp. Copy is tailored for lead-gen. */
const BRANDS = [
  { name: 'Google', Icon: SiGoogle, color: '#4285F4' },
  { name: 'Meta', Icon: SiMeta, color: '#0082FB' },
  { name: 'Shopify', Icon: SiShopify, color: '#96BF48' },
  { name: 'HubSpot', Icon: SiHubspot, color: '#FF7A59' },
  { name: 'Salesforce', Icon: FaSalesforce, color: '#00A1E0' },
  { name: 'Stripe', Icon: SiStripe, color: '#635BFF' },
  { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
  { name: 'Notion', Icon: SiNotion, color: '#a0a0a0' },
  { name: 'TikTok', Icon: SiTiktok, color: '#69C9D0' },
  { name: 'YouTube', Icon: SiYoutube, color: '#FF0000' },
  { name: 'Slack', Icon: FaSlack, color: '#E01E5A' },
  { name: 'Framer', Icon: SiFramer, color: '#0055FF' },
  { name: 'Spotify', Icon: SiSpotify, color: '#1DB954' },
  { name: 'Webflow', Icon: SiWebflow, color: '#4353FF' },
  { name: 'Pinterest', Icon: SiPinterest, color: '#E60023' },
  { name: 'Mailchimp', Icon: SiMailchimp, color: '#FFE01B' },
  { name: 'WooCommerce', Icon: SiWoocommerce, color: '#7F54B3' },
  { name: 'Netflix', Icon: SiNetflix, color: '#E50914' },
  { name: 'Airbnb', Icon: SiAirbnb, color: '#FF5A5F' },
  { name: 'PayPal', Icon: SiPaypal, color: '#003087' },
  { name: 'Zapier', Icon: SiZapier, color: '#FF4A00' },
  { name: 'WordPress', Icon: SiWordpress, color: '#21759B' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', Icon: SiNextdotjs, color: '#a0a0a0' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Discord', Icon: SiDiscord, color: '#5865F2' },
];
const GRID_TILES = Array.from({ length: 90 }, (_, i) => BRANDS[i % BRANDS.length]);

export default function Hero() {
  const brandsRef = useRef(null);
  const posRef = useRef([]);
  const rafRef = useRef(null);

  const cachePos = useCallback(() => {
    if (!brandsRef.current) return;
    const chips = brandsRef.current.querySelectorAll('.nh-hero__brand-chip');
    posRef.current = Array.from(chips).map((el) => {
      const r = el.getBoundingClientRect();
      return { el, cy: r.top + r.height / 2 };
    });
  }, []);

  /* One-shot glow wave on mount: top → bottom, then back. */
  const runWave = useCallback(() => {
    const pts = posRef.current;
    if (!pts.length) return;
    const ys = pts.map((p) => p.cy);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const span = maxY - minY;
    const sigma = span * 0.18;
    const HALF = 2000;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const half = elapsed < HALF;
      const t = Math.min(half ? elapsed / HALF : (elapsed - HALF) / HALF, 1);
      const waveY = half
        ? minY - sigma + t * (span + sigma * 2)
        : maxY + sigma - t * (span + sigma * 2);

      pts.forEach(({ el, cy }) => {
        const dist = Math.abs(cy - waveY);
        el.style.setProperty('--intensity', Math.max(0, 1 - dist / sigma).toFixed(3));
      });

      if (elapsed < HALF * 2) rafRef.current = requestAnimationFrame(frame);
      else pts.forEach(({ el }) => el.style.setProperty('--intensity', '0'));
    }
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      cachePos();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTimeout(runWave, 60);
      }
    }, 200);
    window.addEventListener('resize', cachePos);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', cachePos);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cachePos, runWave]);

  return (
    <section id="top" className="nh-hero">
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
          <span className="nh-hero__badge">
            <span className="dot" /> Now booking — free strategy call
          </span>
          <h1 className="nh-hero__heading">
            WE WILL MAKE<br />
            YOUR BRAND <span className="red">BEAUTIFUL</span>
          </h1>
          <div className="nh-hero__underline" />
          <p className="nh-hero__sub">
            High-converting landing pages &amp; websites engineered for paid ads —
            so every rupee of ad spend brings you more qualified leads, not just traffic.
          </p>
          <div className="nh-hero__ctas">
            <a href="#lead-form" className="sec-btn sec-btn--red sec-btn--lg">
              Get My Free Quote <RiArrowRightLine size={20} />
            </a>
            <a href="#services" className="sec-btn sec-btn--outline-light sec-btn--lg">
              See What We Build
            </a>
          </div>
          <div className="nh-hero__trust">
            <span><RiCheckLine size={16} /> Live in as little as 5 days</span>
            <span><RiCheckLine size={16} /> No lock-ins</span>
            <span><RiCheckLine size={16} /> You own everything</span>
          </div>
        </div>
      </div>

      <div className="nh-hero__stats-bar">
        {heroStats.map((s) => (
          <div key={s.lbl} className="nh-hero__stat-item">
            <span className="nh-hero__stat-val">{s.val}</span>
            <span className="nh-hero__stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
