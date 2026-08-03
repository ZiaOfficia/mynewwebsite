/* ============================================================
   SEO CONFIG — single source of truth for per-route metadata
   ============================================================
   Every public route gets a unique title + description here.
   The sitemap generator reads ROUTE_SEO too, so adding a route
   in one place keeps metadata and sitemap in sync.
   ============================================================ */

export const SITE_URL   = 'https://hibrands.in';
export const SITE_NAME  = 'HiBrands';
export const TWITTER    = '@hibrands';
export const OG_IMAGE   = `${SITE_URL}/og-image.jpg`;
export const OG_LOCALE  = 'en_IN';

/* Absolute URL helper — canonical tags must never be relative. */
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;

/* ── Per-route metadata ───────────────────────────────────────
   title:       50–60 chars, unique, brand suffix added below
   description: 140–160 chars, unique, written to earn the click
   priority/changefreq: consumed by scripts/generate-sitemap.js
   ──────────────────────────────────────────────────────────── */
export const ROUTE_SEO = {
  '/': {
    title:       'Digital Marketing Agency in India',
    description: 'HiBrands is a performance-driven digital marketing agency. SEO, Google Ads, web development and social media that turn traffic into revenue. Free brand audit.',
    priority:    1.0,
    changefreq:  'weekly',
  },
  '/about': {
    title:       'About Us — Who We Are',
    description: 'Meet the team behind HiBrands. A founder-led digital marketing agency built on transparent reporting, no lock-in contracts and measurable growth for every client.',
    priority:    0.7,
    changefreq:  'monthly',
  },
  '/contact': {
    title:       'Contact Us — Get a Free Brand Audit',
    description: 'Talk to HiBrands about your growth goals. Free brand audit, response within 24 hours, no commitment required. Call +91 90649 90515 or send us a message.',
    priority:    0.8,
    changefreq:  'monthly',
  },
  '/services/seo': {
    title:       'SEO Services — Rank Higher, Earn More',
    description: 'Technical SEO, content strategy and authority building that move you to page one for keywords that actually convert. Transparent monthly reporting, no jargon.',
    priority:    0.9,
    changefreq:  'monthly',
  },
  '/services/google-ads': {
    title:       'Google Ads Management — Better ROAS',
    description: 'Google Ads management focused on return, not vanity clicks. Search, Shopping and Performance Max campaigns rebuilt around profitable, high-intent keywords.',
    priority:    0.9,
    changefreq:  'monthly',
  },
  '/services/web-development': {
    title:       'Web Development — Fast Sites That Convert',
    description: 'Custom websites engineered for speed, Core Web Vitals and conversion. Built to load fast, rank well and generate enquiries on autopilot.',
    priority:    0.9,
    changefreq:  'monthly',
  },
  '/services/smo': {
    title:       'Social Media Optimisation Services',
    description: 'Social media optimisation for brands that want enquiries, not just likes. Instagram, Facebook and YouTube strategy built around your real audience.',
    priority:    0.9,
    changefreq:  'monthly',
  },
  '/services/landing-pages': {
    title:       'Landing Page Design That Converts',
    description: 'High-converting landing pages designed and built around a single goal. Same traffic, same budget, dramatically better conversion rate.',
    priority:    0.9,
    changefreq:  'monthly',
  },
};

/* Routes to prerender and list in the sitemap. */
export const PUBLIC_ROUTES = Object.keys(ROUTE_SEO);

/* Look up metadata for a pathname, falling back to the home entry. */
export function getRouteSeo(pathname) {
  const clean = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  return ROUTE_SEO[clean] || null;
}
