/* ============================================================
   Page metadata + JSON-LD for the Next.js App Router
   ============================================================
   In a page file:
     export const metadata = pageMetadata({ pathname: '/about' });
   Titles/descriptions default to the entry in seo.config.js.
   ============================================================ */

import { SITE_NAME, TWITTER, OG_IMAGE, OG_LOCALE, absoluteUrl, getRouteSeo } from './seo.config.js';
import { buildGraph } from './schema.js';

export function pageMetadata({
  pathname,
  title,
  description,
  image = OG_IMAGE,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}) {
  const preset = getRouteSeo(pathname) || {};
  const rawTitle = title || preset.title || SITE_NAME;
  const desc = description || preset.description || '';
  const fullTitle = pathname === '/' ? `${SITE_NAME} | ${rawTitle}` : `${rawTitle} | ${SITE_NAME}`;
  const canonical = absoluteUrl(pathname);

  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      url: canonical,
      title: fullTitle,
      description: desc,
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — ${rawTitle}` }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER,
      creator: TWITTER,
      title: fullTitle,
      description: desc,
      images: [image],
    },
  };
}

/* <JsonLd pathname="/about" title="About" extra={[…]} /> */
export function JsonLd({ pathname, title, extra = [] }) {
  const preset = getRouteSeo(pathname) || {};
  const graph = buildGraph({ pathname, title: title || preset.title || SITE_NAME, extra });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  );
}
