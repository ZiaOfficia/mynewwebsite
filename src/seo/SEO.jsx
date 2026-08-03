/* ============================================================
   <SEO /> — per-page head tags
   ============================================================
   Renders title, description, canonical, robots, Open Graph,
   Twitter Card and JSON-LD. Drop one into every page component.

     <SEO
       title="SEO Services — Rank Higher, Earn More"
       description="…"
       pathname="/services/seo"
     />

   Omit props on a route listed in seo.config.js and the values
   there are used, so metadata lives in one place.
   ============================================================ */

import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME, TWITTER, OG_IMAGE, OG_LOCALE,
  absoluteUrl, getRouteSeo,
} from './seo.config.js';
import { buildGraph } from './schema.js';

export default function SEO({
  title,
  description,
  pathname,
  image     = OG_IMAGE,
  type      = 'website',
  noindex   = false,
  schema    = [],
}) {
  const location = useLocation();
  const path     = pathname || location.pathname;
  const preset   = getRouteSeo(path) || {};

  const rawTitle = title       || preset.title       || SITE_NAME;
  const desc     = description || preset.description || '';
  const canonical = absoluteUrl(path);

  /* Home shows the tagline; inner pages get the brand as a suffix. */
  const fullTitle = path === '/'
    ? `${SITE_NAME} | ${rawTitle}`
    : `${rawTitle} | ${SITE_NAME}`;

  const jsonLd = buildGraph({ pathname: path, title: rawTitle, extra: schema });

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en-IN" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* ── Open Graph ── */}
      <meta property="og:type"            content={type} />
      <meta property="og:site_name"       content={SITE_NAME} />
      <meta property="og:locale"          content={OG_LOCALE} />
      <meta property="og:url"             content={canonical} />
      <meta property="og:title"           content={fullTitle} />
      <meta property="og:description"     content={desc} />
      <meta property="og:image"           content={image} />
      <meta property="og:image:width"     content="1200" />
      <meta property="og:image:height"    content="630" />
      <meta property="og:image:alt"       content={`${SITE_NAME} — ${rawTitle}`} />

      {/* ── Twitter ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER} />
      <meta name="twitter:creator"     content={TWITTER} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={image} />
      <meta name="twitter:image:alt"   content={`${SITE_NAME} — ${rawTitle}`} />

      {/* ── Structured data ── */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
