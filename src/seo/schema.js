/* ============================================================
   JSON-LD STRUCTURED DATA
   ============================================================
   Node @ids are stable and cross-referenced so Google resolves
   one connected graph rather than isolated islands.
   ============================================================ */

import { SITE_URL, SITE_NAME, OG_IMAGE, absoluteUrl } from './seo.config.js';
import { agency } from '../data/index.js';

const ORG_ID     = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#professionalservice`;

/* Phone in E.164 for schema — '+91 90649 90515' → '+919064990515' */
const telephone = agency.phone.replace(/\s+/g, '');

const sameAs = Object.values(agency.social).filter(
  (url) => url && !/^https?:\/\/(www\.)?(instagram|facebook|twitter|linkedin|youtube)\.com\/?$/.test(url)
);

export const organizationSchema = {
  '@type': 'Organization',
  '@id':   ORG_ID,
  name:    SITE_NAME,
  url:     `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url:     `${SITE_URL}/favicon.svg`,
    caption: SITE_NAME,
  },
  image:       OG_IMAGE,
  description: agency.description,
  slogan:      agency.tagline,
  telephone,
  address: {
    '@type':      'PostalAddress',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type':             'ContactPoint',
    telephone,
    contactType:         'sales',
    areaServed:          'IN',
    availableLanguage:   ['en', 'hi'],
  },
  ...(sameAs.length ? { sameAs } : {}),
};

export const websiteSchema = {
  '@type':    'WebSite',
  '@id':      WEBSITE_ID,
  url:        `${SITE_URL}/`,
  name:       SITE_NAME,
  description: agency.description,
  publisher:  { '@id': ORG_ID },
  inLanguage: 'en-IN',
};

export const professionalServiceSchema = {
  '@type':      'ProfessionalService',
  '@id':        SERVICE_ID,
  name:         SITE_NAME,
  url:          `${SITE_URL}/`,
  image:        OG_IMAGE,
  description:  agency.description,
  telephone,
  parentOrganization: { '@id': ORG_ID },
  priceRange:   '₹₹',
  address: {
    '@type':        'PostalAddress',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'Country', name: 'India' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name:    'Digital Marketing Services',
    itemListElement: [
      'Search Engine Optimisation',
      'Google Ads Management',
      'Website Development',
      'Social Media Optimisation',
      'Landing Page Design',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
    })),
  },
};

/* BreadcrumbList — only meaningful below the root. */
export function breadcrumbSchema(pathname, pageTitle) {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return null;

  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }];

  segments.forEach((segment, i) => {
    const path = `/${segments.slice(0, i + 1).join('/')}`;
    const isLast = i === segments.length - 1;
    const name = isLast
      ? pageTitle
      : segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      '@type':  'ListItem',
      position: i + 2,
      name,
      item:     absoluteUrl(path),
    });
  });

  return { '@type': 'BreadcrumbList', itemListElement: crumbs };
}

/* Single @graph payload — one <script> tag per page. */
export function buildGraph({ pathname, title, extra = [] }) {
  const graph = [
    organizationSchema,
    websiteSchema,
    professionalServiceSchema,
    breadcrumbSchema(pathname, title),
    ...extra,
  ].filter(Boolean);

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* Service page detail node — merged into the graph by ServiceDetail. */
export function serviceSchema({ name, description, pathname }) {
  return {
    '@type':      'Service',
    '@id':        `${absoluteUrl(pathname)}#service`,
    name,
    description,
    url:          absoluteUrl(pathname),
    provider:     { '@id': ORG_ID },
    areaServed:   { '@type': 'Country', name: 'India' },
    serviceType:  name,
  };
}
