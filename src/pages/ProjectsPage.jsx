import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, projectCategories } from '../data/index.js';
import SEO from '../seo/SEO.jsx';
import CTA from '../sections/CTA/CTA.jsx';
import './Home.css';
import './Projects.css';

/* Screenshots captured by `npm run previews`. Globbing the folder rather
   than naming files in the data means a preview appears as soon as it is
   captured and simply stays absent until then — never a broken image, and
   never a stand-in dressed up as the real site. */
const PREVIEWS = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/projects/*.{jpg,jpeg,png,webp}', {
      eager: true, query: '?url', import: 'default',
    })
  ).map(([file, url]) => [file.split('/').pop().replace(/\.\w+$/, ''), url])
);

/* Client logos, downloaded from each live site — see logos/SOURCES.md.
   A project without one falls back to its monogram in the hero tile. */
const LOGOS = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/logos/*.{svg,png,jpg,webp}', {
      eager: true, query: '?url', import: 'default',
    })
  ).map(([file, url]) => [file.split('/').pop().replace(/\.\w+$/, ''), url])
);

/* The tiled logo field behind the hero, same as the other pages. Stepping by
   3 through 8 clients (coprime, so every client still appears equally often)
   stops the same logo lining up in a column of the 10-wide grid. */
const HERO_TILES = Array.from(
  { length: 90 },
  (_, i) => projects[(i * 3) % projects.length]
);

/* Filter tab label → the category stored on each project. */
const CATEGORY_OF = { Websites: 'Website', 'Landing Pages': 'Landing Page' };

/* Card accents are authored as hex; the CSS needs channels for rgba(). */
function hexToRgb(hex) {
  const raw = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(raw.slice(i, i + 2), 16)).join(',');
}

/* "https://www.dumuzi.in/" → "www.dumuzi.in" — the browser-bar caption. */
function displayUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function ExternalIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/* Closing card. The grid is a selection, not a catalogue, so it ends on an
   invitation rather than a full stop — and lands on the enquiry form. */
function MoreCard() {
  return (
    <article className="pj-card pj-card--more nh-reveal">
      <Link className="pj-more" to="/contact">
        <span className="pj-more__mark" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <h3 className="pj-more__title">MORE PROJECTS</h3>
        <p className="pj-more__desc">
          What you see here is a selection of our work — there's plenty more across
          other industries, budgets and timelines. Tell us what you have in mind and
          we'll share the projects closest to it.
        </p>
        <span className="pj-more__cta">
          Start an Enquiry
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </article>
  );
}

function ProjectCard({ project }) {
  const preview  = PREVIEWS[project.slug];
  const isSite   = project.category === 'Website';
  const ctaLabel = project.ctaLabel || (isSite ? 'Visit Website' : 'View Landing Page');

  return (
    <article
      className="pj-card nh-reveal"
      style={{ '--card-accent': project.accent, '--card-accent-rgb': hexToRgb(project.accent) }}
    >
      {/* The whole preview is the primary click target. */}
      <a
        className="pj-frame"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} — open the live site in a new tab`}
      >
        <div className="pj-chrome">
          <span className="pj-chrome__dots" aria-hidden="true"><span /><span /><span /></span>
          <span className="pj-chrome__url">{displayUrl(project.url)}</span>
          <span className="pj-chrome__open"><ExternalIcon size={15} /></span>
        </div>

        {preview ? (
          <div className="pj-shot">
            <img
              className="pj-shot__img"
              src={preview}
              alt={`Screenshot of the ${project.name} homepage`}
              width="1200"
              height="750"
              loading="lazy"
              decoding="async"
            />
            <span className="pj-shot__veil" aria-hidden="true" />
          </div>
        ) : (
          <div className="pj-shot pj-shot--empty">
            <span className="pj-shot__monogram" aria-hidden="true">{project.name.charAt(0)}</span>
            <span className="pj-shot__note">Preview coming soon</span>
          </div>
        )}
      </a>

      <div className="pj-card__body">
        <span className="pj-badge">{project.category}</span>
        <h3 className="pj-card__name">{project.name}</h3>
        <p className="pj-card__desc">{project.description}</p>

        <ul className="pj-tags">
          {project.tags.map((tag) => <li key={tag} className="pj-tag">{tag}</li>)}
        </ul>

        <div className="pj-actions">
          <a className="pj-cta" href={project.url} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
            <ExternalIcon />
          </a>
          {project.secondary && (
            <a
              className="pj-cta pj-cta--ghost"
              href={project.secondary.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.secondary.label}
              <ExternalIcon size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All');

  const visible = useMemo(
    () => (filter === 'All'
      ? projects
      : projects.filter((p) => p.category === CATEGORY_OF[filter])),
    [filter]
  );

  /* The sectors we've built for, taken from each project's leading tag.
     Breadth of work, without putting a number on it. */
  const sectors = useMemo(
    () => [...new Set(projects.map((p) => p.tags[0]))],
    []
  );

  /* Same reveal-on-scroll wiring the other pages use. Re-runs on filter
     change so cards mounted by a filter animate in too. */
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filter]);

  /* Lets Google read the portfolio as one collection of real works. */
  const itemListSchema = {
    '@type': 'ItemList',
    name: 'HiBrands Projects',
    itemListElement: projects.map((project, i) => ({
      '@type':  'ListItem',
      position: i + 1,
      item: {
        '@type':     'CreativeWork',
        name:        project.name,
        description: project.description,
        url:         project.url,
      },
    })),
  };

  return (
    <main className="projects-page">
      <SEO pathname="/projects" schema={[itemListSchema]} />

      {/* ── Hero — same structure as the About and service heroes, with
             the client logos as the tile field behind it ── */}
      <section className="nh-hero sd-hero pj-hero">
        <div className="nh-hero__brands" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {HERO_TILES.map((project, i) => (
            <div key={i} className="nh-hero__brand-chip" style={{ '--brand-color': project.accent }}>
              {LOGOS[project.slug] ? (
                <img className="nh-hero__brand-icon pj-hero__logo" src={LOGOS[project.slug]} alt="" />
              ) : (
                <span className="nh-hero__brand-icon pj-hero__monogram">{project.name.charAt(0)}</span>
              )}
              <span className="nh-hero__brand-label">{project.name}</span>
            </div>
          ))}
        </div>
        <div className="nh-hero__overlay" />

        <div className="container sd-hero__inner">
          <div className="nh-hero__center">
            <span className="sec-eyebrow sec-eyebrow--light nh-reveal">Our Work</span>
            <h1 className="nh-hero__heading nh-reveal nh-delay-1">
              OUR <span className="nh-hero__red">PROJECTS.</span>
            </h1>
            <div className="nh-hero__underline nh-reveal nh-delay-2" />
            <p className="sd-hero__why nh-reveal nh-delay-3">
              A showcase of websites and landing pages crafted by HiBrands for businesses,
              organisations and brands — each one live, and one click away.
            </p>
          </div>
        </div>

        {/* Sits where the other heroes put their stats bar. */}
        <div className="nh-hero__stats-bar pj-hero__sectors nh-reveal nh-delay-4">
          <span className="pj-hero__sectors-lbl">Built for</span>
          {/* A flex row, not inline text: JSX collapses the whitespace
              between these spans, so an inline run would never wrap. */}
          <p className="pj-hero__sectors-list">
            {[...sectors, 'and more'].map((sector, i) => (
              <Fragment key={sector}>
                {i > 0 && <span className="pj-hero__sep" aria-hidden="true">·</span>}
                <span className={`pj-hero__sector${i === sectors.length ? ' pj-hero__sectors-more' : ''}`}>
                  {sector}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </section>

      {/* ── The work ── */}
      <section className="pj-work">
        <div className="pj-work__glow" aria-hidden="true" />
        <div className="container pj-work__inner">

          <div className="pj-filters nh-reveal" role="group" aria-label="Filter projects by type">
            {projectCategories.map((label) => (
              <button
                key={label}
                type="button"
                aria-pressed={filter === label}
                className={`pj-filter ${filter === label ? 'pj-filter--active' : ''}`}
                onClick={() => setFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="pj-grid">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
            {/* Closes out every view, filtered or not. */}
            <MoreCard />
          </div>

          <p className="pj-note nh-reveal">
            Every project shown here is live — open any of them and judge the work for yourself.
          </p>
        </div>
      </section>

      <CTA
        color="var(--gold)"
        quote={`"The best portfolio piece we have is the one we haven't built yet — yours."`}
        sub="Tell us what you need built and we'll show you the closest thing we've shipped, with an honest timeline and price."
      />
    </main>
  );
}
