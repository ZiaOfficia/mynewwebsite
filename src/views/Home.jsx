'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects, serviceDetails } from '../data/index.js';
import { useBooking } from '../components/BookingModal/BookingContext.jsx';
import CTA from '../sections/CTA/CTA.jsx';

/* ================================================================
   HERO — the agency bill, unbundled
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
  /* Starts on "Agency", then crosses the overhead out once on load.
     The toggle lets visitors flip between the two views themselves. */
  const [mode, setMode] = useState('agency');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(() => setMode('direct'), reduce ? 0 : 1400);
    return () => clearTimeout(id);
  }, []);

  const direct = mode === 'direct';
  const kept = direct ? 1 : BILL_LINES.length;

  return (
    <div className={`bill ${direct ? 'bill--direct' : ''}`}>
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
      <div className="hm-hero__sun" aria-hidden="true" />
      <div className="container hm-hero__grid">
        <div className="hm-hero__copy">
          <p className="hm-hero__hello">
            Hi, we're HiBrands
          </p>
          <h1 className="t-hero hm-hero__title">
            You pay for the work. Not the agency around it.
          </h1>
          <p className="lede hm-hero__lede">
            We're a team of working engineers. We build your website, run your SEO,
            social media and Google Ads ourselves, and you talk to us directly.
            No account managers, no office overheads, no markup on your bill.
          </p>
          <div className="hm-hero__ctas">
            <button type="button" className="btn btn--primary" onClick={openBooking}>
              Book a free call
            </button>
            <Link href="/projects" className="btn btn--line">See our work</Link>
          </div>
        </div>

        <AgencyBill />
      </div>
    </section>
  );
}

/* ================================================================
   WHO'S BETWEEN YOU AND THE WORK
   ================================================================ */
const AGENCY_CHAIN = ['You', 'Sales rep', 'Account manager', 'Project manager', 'Engineer'];

function Chain() {
  return (
    <section className="hm-chain section">
      <div className="container">
        <div className="sec-head">
          <h2 className="t-1">Fewer people in the middle.</h2>
          <p>
            At an agency, your request is passed along three or four times before it
            reaches the person who does the work. With us, you message that person.
          </p>
        </div>

        <div className="chain">
          <div className="chain__row">
            <p className="chain__who">At an agency</p>
            <ol className="chain__steps">
              {AGENCY_CHAIN.map((step, i) => (
                <li key={step} className={`chain__node ${i === 0 ? 'chain__node--you' : ''} ${i === AGENCY_CHAIN.length - 1 ? 'chain__node--eng' : ''}`}>
                  {step}
                </li>
              ))}
            </ol>
            <p className="chain__note">4 hand-offs. Each one adds cost and time.</p>
          </div>

          <div className="chain__row chain__row--direct">
            <p className="chain__who">With HiBrands</p>
            <ol className="chain__steps">
              <li className="chain__node chain__node--you">You</li>
              <li className="chain__node chain__node--eng">Engineer</li>
            </ol>
            <p className="chain__note">No hand-offs. You talk to the person building it.</p>
          </div>
        </div>
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
      <Chain />
      <Services />
      <Work previews={previews} />
      <Process />
      <Quotes />
      <CTA />
    </main>
  );
}
