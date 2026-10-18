'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects, serviceDetails } from '../data/index.js';
import { useBooking } from '../components/BookingModal/BookingContext.jsx';
import CTA from '../sections/CTA/CTA.jsx';
import HiMark from '../components/HiMark.jsx';

/* ================================================================
   THE AGENCY BILL, UNBUNDLED
   ================================================================ */
const BILL_LINES = [
  { label: 'Account manager',        kind: 'Overhead' },
  { label: 'Office rent and upkeep', kind: 'Overhead' },
  { label: 'HR and admin staff',     kind: 'Overhead' },
  { label: 'Sales team commission',  kind: 'Overhead' },
  { label: 'Agency profit margin',   kind: 'Markup'   },
  { label: 'The actual work',        kind: 'Work', work: true },
];

function AgencyBill() {
  /* Starts on "An agency", then crosses the overhead out once, when the
     bill scrolls into view. The toggle lets visitors flip back and forth. */
  const [mode, setMode] = useState('agency');
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      timer = setTimeout(() => setMode('direct'), reduce ? 0 : 700);
      io.disconnect();
    }, { threshold: 0.6 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);

  const direct = mode === 'direct';
  const kept = direct ? 1 : BILL_LINES.length;

  return (
    <div ref={ref} className={`bill ${direct ? 'bill--direct' : ''}`}>
      <div className="bill__top">
        <p className="bill__title">What your money pays for</p>
        <div className="bill__switch" role="group" aria-label="Compare who you hire">
          <button type="button" aria-pressed={!direct} onClick={() => setMode('agency')}>An agency</button>
          <button type="button" aria-pressed={direct} onClick={() => setMode('direct')}>HiBrands</button>
        </div>
      </div>

      <ul className="bill__lines">
        {BILL_LINES.map((line, i) => (
          <li
            key={line.label}
            className={`bill__line ${line.work ? 'bill__line--work' : ''}`}
            style={{ '--i': i }}
          >
            <span className="bill__label">
              <span className="bill__strike" aria-hidden="true" />
              {line.label}
              {!line.work && direct && <span className="sr-only"> (not on your bill)</span>}
            </span>
            <span className="bill__kind">{line.work && direct ? 'All of it' : line.kind}</span>
          </li>
        ))}
      </ul>

      <div className="bill__foot" aria-live="polite">
        <span className="bill__count">{kept}</span>
        <span>
          {direct
            ? 'thing on your bill. Every rupee goes into the work.'
            : 'things on your bill. Only one of them is the work.'}
        </span>
      </div>
    </div>
  );
}

function Hero() {
  const { openBooking } = useBooking();
  return (
    <section className="hm-hero">
      <div className="container hm-hero__grid">
        <div className="hm-hero__copy">
          <h1 className="t-hero hm-hero__title">
            You pay for the work. Not the agency around it.
          </h1>
          <p className="lede hm-hero__lede">
            We're not an agency. We're working engineers who build your website and
            run your SEO, social media and Google Ads ourselves. You talk to us directly,
            and you pay a fair price for the work, nothing more.
          </p>
          <div className="hm-hero__ctas">
            <button type="button" className="btn btn--primary" onClick={openBooking}>
              Book a free call
            </button>
            <Link href="/projects" className="btn btn--line">See our work</Link>
          </div>
        </div>

        <div className="hm-hero__mark">
          <span className="hm-hero__halo" aria-hidden="true" />
          <HiMark className="hm-hero__hi" title="HiBrands says hi" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   THE 45-SECOND FILM, right under the hero
   Muted autoplay only while it is on screen; poster first, so it never
   slows the first paint. Reduced-motion visitors get a play button.
   ================================================================ */
const FILM_LINES = [
  'Big dreams. Limited resources.',
  "Growth shouldn't be out of reach.",
  'Meet HiBrands. Your partner in digital growth.',
  'Built by engineers. Designed for real businesses.',
  'Five services today. Much more on the way.',
  'Premium services. Local prices. Zero compromise on ambition.',
  'Your business deserves more. From local business to brand.',
  "Let's build what's next. Engineers, not an agency. Build with HiBrands.",
];

function HeroFilm() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    v.muted = true;
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduce(r);
    if (r) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      if (v.currentTime > 40) v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const play = () => videoRef.current?.play().catch(() => {});

  return (
    <section className="hm-film" aria-labelledby="hm-film-title">
      <div className="container">
        <div className="hm-film__frame">
          <video
            ref={videoRef}
            className="hm-film__video"
            muted
            playsInline
            preload="metadata"
            poster="/video/hibrands-intro-poster.jpg"
            aria-describedby="hm-film-transcript"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/video/hibrands-intro.webm" type="video/webm" />
            <source src="/video/hibrands-intro.mp4" type="video/mp4" />
          </video>
          {reduce && !playing ? (
            <button type="button" className="hm-film__play" onClick={play} aria-label="Play the 45-second HiBrands film">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </button>
          ) : null}
          <button type="button" className="hm-film__sound" onClick={toggleSound} aria-pressed={!muted}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9h4l5-4v14l-5-4H4z" />
              {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />}
            </svg>
            {muted ? 'Sound on' : 'Sound off'}
          </button>
        </div>
        <div className="hm-film__cap">
          <h2 id="hm-film-title" className="hm-film__title">Meet HiBrands in 45 seconds.</h2>
          <p id="hm-film-transcript" className="sr-only">{FILM_LINES.join(' ')}</p>
        </div>
      </div>
    </section>
  );
}

function Bill() {
  return (
    <section className="hm-bill section">
      <div className="container hm-bill__grid">
        <div className="sec-head hm-bill__head">
          <h2 className="t-1">Where an agency bill really goes.</h2>
          <p>
            Most of what you pay an agency keeps the agency running. Flip the switch
            to see what's left when you hire the engineers directly.
          </p>
        </div>
        <AgencyBill />
      </div>
    </section>
  );
}

/* ================================================================
   WHY WE EXIST — the message, in plain words
   ================================================================ */
const PROMISES = [
  {
    title: 'No big offices to pay for',
    text:  'Agencies grow by adding buildings, managers and margins, and clients pay for all of it. We stay small on purpose, so your money goes into your project.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 27V8l9-3v22M16 12h9v15M11 12h1M11 17h1M11 22h1M20 17h1M20 22h1M4 27h24" />
        <path d="M5 5l22 22" stroke="var(--cobalt)" strokeWidth="2.6" />
      </svg>
    ),
  },
  {
    title: 'No wall between you and us',
    text:  'Call or message the engineer who is doing your work. No sales reps, no account managers passing messages back and forth.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7" cy="16" r="4" />
        <circle cx="25" cy="16" r="4" />
        <path d="M11 16h10" stroke="var(--cobalt)" strokeWidth="2.6" />
      </svg>
    ),
  },
  {
    title: 'Fair prices, told up front',
    text:  'We keep our margin small because we are here to help, not to get rich. You get a fixed price before anything starts, with no hidden fees.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 4H27v10L15 26a2.8 2.8 0 0 1-4 0l-6-6a2.8 2.8 0 0 1 0-4z" />
        <path d="M13 13h6M13 16h6M17 13c2 0 2 3 0 3h-3l4 4" stroke="var(--cobalt)" strokeWidth="2.2" />
      </svg>
    ),
  },
];

function WhyUs() {
  return (
    <section className="hm-why">
      <div className="container">
        <div className="hm-why__intro">
          <h2 className="hm-why__title">We're not an agency built for profit.</h2>
          <p className="hm-why__text">
            We started HiBrands to break the wall between engineers and the businesses
            that need them. No towers, no layers, no big margins. Just skilled people
            doing honest work for a fair price.
          </p>
        </div>

        <ul className="hm-why__list">
          {PROMISES.map((p) => (
            <li key={p.title} className="promise">
              <span className="promise__icon">{p.icon}</span>
              <h3 className="promise__title">{p.title}</h3>
              <p className="promise__text">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================================================================
   SERVICES — a list, priced up front
   ================================================================ */
function startingPrice(slug) {
  const pkgs = serviceDetails[slug]?.packages || [];
  const priced = pkgs.find((p) => p.price && p.price !== 'Custom');
  if (!priced) return null;
  return `From ${priced.price}${priced.period || ''}`;
}

const SERVICE_ROWS = [
  { slug: 'web-development', name: 'Websites',      line: 'Fast, mobile-first sites that load quickly, rank well and bring in enquiries.' },
  { slug: 'landing-pages',   name: 'Landing pages', line: 'One page, one goal. Built to turn ad clicks into leads.' },
  { slug: 'seo',             name: 'SEO',           line: 'Technical fixes, content and links that move you up Google, and keep you there.' },
  { slug: 'smo',             name: 'Social media',  line: 'Regular posts, reels and replies that turn followers into customers.' },
  { slug: 'google-ads',      name: 'Google Ads',    line: 'Campaigns where every rupee is tracked, and you see exactly where it went.' },
];

function Services() {
  return (
    <section className="hm-services section" id="services">
      <div className="container">
        <div className="sec-head">
          <h2 className="t-1">What we build and run</h2>
          <p>Five services, priced up front. Pick one, or combine them.</p>
        </div>

        <ul className="svc-list">
          {SERVICE_ROWS.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="svc-row">
                <span className="svc-row__name">{s.name}</span>
                <span className="svc-row__line">{s.line}</span>
                <span className="svc-row__price">{startingPrice(s.slug) || 'Custom quote'}</span>
                <span className="svc-row__go" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================================================================
   RECENT WORK — real, live client sites
   ================================================================ */
function Work({ previews }) {
  const picks = projects.filter((p) => previews.includes(p.slug)).slice(0, 4);
  return (
    <section className="hm-work section">
      <div className="container">
        <div className="hm-work__head">
          <div className="sec-head">
            <h2 className="t-1">Recent work, all live</h2>
            <p>Open any of them and judge the work for yourself.</p>
          </div>
          <Link href="/projects" className="link">See all projects</Link>
        </div>

        <div className="work-grid">
          {picks.map((p, i) => (
            <a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`work-card work-card--${i}`}
            >
              <span className="work-card__shot">
                <Image src={`/projects/${p.slug}.jpg`} alt={`${p.name} website homepage`} width={1200} height={750} sizes="(max-width: 700px) 100vw, 50vw" />
              </span>
              <span className="work-card__meta">
                <span className="work-card__name">{p.name}</span>
                <span className="work-card__tags">{p.tags.slice(0, 2).join(', ')}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PROCESS — a real sequence, so it's numbered
   ================================================================ */
const STEPS = [
  { title: 'A free call',          desc: 'Tell us what you need. You speak with the engineer who would do the work, not a salesperson.' },
  { title: 'A plan and a price',   desc: 'You get a written scope, a timeline and a fixed price before anything starts.' },
  { title: 'We build and launch',  desc: 'You see progress every week and can message us directly whenever you want.' },
  { title: 'We keep improving it', desc: 'Monthly reports in plain language. No lock-in contract, so you stay because it works.' },
];

function Process() {
  return (
    <section className="hm-process section">
      <div className="container">
        <div className="sec-head">
          <h2 className="t-1">How a project runs</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num">{i + 1}</span>
              <h3 className="t-3 step__title">{s.title}</h3>
              <p className="step__desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ================================================================
   WHAT CLIENTS SAY
   ================================================================ */
const QUOTES = [
  { name: 'Rahul Sharma',  tag: 'SEO',             text: 'We went from page 5 to position 1 in about six months, and leads have never been higher.' },
  { name: 'Priya Kapoor',  tag: 'Google Ads',      text: 'Our ROAS went from 1.2x to 4.8x in three months. I only wish we had found them sooner.' },
  { name: 'David Mills',   tag: 'Website',         text: 'New website launched, leads doubled in month one. On time, on budget, and we always knew what was happening.' },
  { name: 'Ananya Iyer',   tag: 'Social media',    text: 'Our Instagram went from an afterthought to our biggest source of enquiries. They actually understood our audience.' },
  { name: 'Vikram Mehta',  tag: 'SEO',             text: 'Every month I know exactly what was done, what it cost and what it returned. No jargon.' },
  { name: 'Sana Qureshi',  tag: 'Landing page',    text: 'Same traffic, same budget. Our conversion rate nearly tripled with a page that finally does its job.' },
];

function Quotes() {
  return (
    <section className="hm-quotes section">
      <div className="container">
        <div className="sec-head">
          <h2 className="t-1">What clients say</h2>
        </div>
        <div className="quotes">
          {QUOTES.map((q) => (
            <figure key={q.name} className="quote">
              <blockquote className="quote__text">{q.text}</blockquote>
              <figcaption className="quote__who">
                <span className="quote__avatar" aria-hidden="true">{q.name.charAt(0)}</span>
                <span>
                  <span className="quote__name">{q.name}</span>
                  <span className="quote__tag">{q.tag}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home({ previews = [] }) {
  return (
    <main className="home-page">
      <Hero />
      <HeroFilm />
      <WhyUs />
      <Bill />
      <Services />
      <Work previews={previews} />
      <Process />
      <Quotes />
      <CTA />
    </main>
  );
}
