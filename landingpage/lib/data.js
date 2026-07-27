/* ============================================================
   LANDING PAGE DATA — HiBrands (paid-ads, conversion-focused)
   Only the two services this campaign sells: Landing Pages & Websites.
   Values mirror the main site's data layer for brand consistency.
   Icons are Remix Icon components (react-icons/ri) — the same set used for
   the inline checkmarks — so every glyph renders as a vector, not an emoji.
   ============================================================ */

import {
  RiFocus3Line,
  RiFlashlightLine,
  RiLineChartLine,
  RiShakeHandsLine,
  RiComputerLine,
} from 'react-icons/ri';

export const agency = {
  name:    'HiBrands',
  tagline: 'Say Hi to Growth.',
  email:   'hello@hibrands.in',
  phone:   '+91 00000 00000',
  // Where the header's "Main Website" tab points. Change this one line if the
  // main site lives on a different domain.
  site:    'https://hibrands.in',
};

// ── Hero stats bar (matches main site hero) ───────────────────
export const heroStats = [
  { val: '150+', lbl: 'Projects Delivered' },
  { val: '62%',  lbl: 'Avg. CPA Drop' },
  { val: '3x',   lbl: 'Avg. Lead Lift' },
  { val: '<24h', lbl: 'Response Time' },
];

// ── Why choose us ─────────────────────────────────────────────
export const whyUs = [
  {
    Icon:  RiFocus3Line,
    title: 'Built to Convert',
    body:  'Every page is engineered around one job — turning paid clicks into qualified leads. Persuasive copy, clear CTAs, and friction-free forms as standard.',
  },
  {
    Icon:  RiFlashlightLine,
    title: 'Ships in Days, Not Months',
    body:  'A high-converting landing page can go live in as little as 5 days. Websites in 3 weeks. Move fast without cutting corners on quality.',
  },
  {
    Icon:  RiLineChartLine,
    title: 'Lower Cost Per Lead',
    body:  'Ad-ready pages built with speed and message-match in mind — so your Google & Meta traffic converts at the highest possible rate.',
  },
  {
    Icon:  RiShakeHandsLine,
    title: 'No Lock-Ins, Full Transparency',
    body:  'Dedicated point of contact, clear scope, and honest reporting. You own everything we build — no hostage-ware, no surprises.',
  },
];

// ── The two services ──────────────────────────────────────────
export const services = [
  {
    id:        'landing-pages',
    accent:    '#4F46E5',
    accentRgb: '79,70,229',
    Icon:      RiFocus3Line,
    eyebrow:   'Landing Page Development',
    title:     'Landing Pages',
    titleRest: 'That Convert',
    tagline:   'One page. One goal. Maximum conversions.',
    intro:     'Driving expensive ad traffic to a generic homepage is the fastest way to burn budget. We build laser-focused, benefit-driven landing pages that match your ad message perfectly and guide every visitor toward a single action.',
    features: [
      'Conversion-focused design',
      'Persuasive, benefit-led copy',
      'A/B test-ready layouts',
      'Mobile-first & lightning fast',
      'Lead-capture & CRM integration',
      'Thank-you page + tracking setup',
    ],
    result: 'Decreased Cost Per Acquisition by 62%, producing a 3x increase in total leads on the exact same ad spend.',
    stats: [
      { val: '80+', lbl: 'Pages Built' },
      { val: '62%', lbl: 'CPA Reduction' },
      { val: '3x',  lbl: 'Lead Increase' },
      { val: '95%', lbl: 'Client Satisfaction' },
    ],
    packages: [
      { name: 'Single Flow', price: '₹3,999', oldPrice: '₹9,999', tagline: 'One page, one goal.', popular: true,
        features: ['Conversion-focused design', 'Mobile-first layout', 'Lead form setup', 'Speed optimisation', 'Thank-you page'] },
      { name: 'Funnel Build', price: 'Custom', tagline: 'Multi-step conversion flows.',
        features: ['Squeeze pages', 'Up-sell / down-sell logic', 'Email sequence integration', 'Video sales letters', 'Full CRM integration'] },
    ],
  },
  {
    id:        'web-development',
    accent:    '#8B5CF6',
    accentRgb: '139,92,246',
    Icon:      RiComputerLine,
    eyebrow:   'Website Development',
    title:     'Websites',
    titleRest: 'That Sell',
    tagline:   'Fast, modern sites engineered for growth.',
    intro:     'Your website is your 24/7 storefront. We design and develop custom, mobile-first websites that look stunning, load instantly, rank well, and turn visitors into customers — built on a modern, scalable tech stack.',
    features: [
      'Custom UI/UX design',
      'Mobile-first & fully responsive',
      'Core Web Vitals optimised',
      'SEO-ready structure',
      'CMS / WordPress integration',
      'Post-launch support',
    ],
    result: 'Redesigned for speed and clear conversion flows — cut bounce rate by 40% on launch and doubled monthly enquiries within 30 days.',
    stats: [
      { val: '50+', lbl: 'Sites Delivered' },
      { val: '2x',  lbl: 'Avg. Lead Increase' },
      { val: '3wk', lbl: 'Typical Launch' },
      { val: '40%', lbl: 'Bounce Rate Drop' },
    ],
    packages: [
      { name: 'Business Site', price: '₹9,999', oldPrice: '₹24,999', tagline: 'For service businesses needing authority.',
        features: ['Custom UI/UX design', 'Up to 7 pages', 'Mobile responsive', 'Speed optimised', 'Basic SEO setup'] },
      { name: 'E-commerce', price: '₹19,999', oldPrice: '₹49,999', tagline: 'Start selling online easily.', popular: true,
        features: ['React / Next.js / Node.js', 'Payment gateway', 'Up to 50 products', 'Advanced speed optimisation', 'Inventory management'] },
      { name: 'Custom App', price: 'Custom', tagline: 'Complex web platforms.',
        features: ['React / Next.js', 'Custom backend', 'Third-party API integrations', 'High performance', 'Advanced security'] },
    ],
  },
];

// ── Process ───────────────────────────────────────────────────
export const process = [
  { no: '01', title: 'Discovery Call', body: 'A free, no-pressure call to understand your offer, audience, and goals — and map the fastest path to more leads.' },
  { no: '02', title: 'Strategy & Copy', body: 'We craft the message, structure, and conversion strategy — matched to your ad campaigns so traffic feels at home.' },
  { no: '03', title: 'Design & Build', body: 'Pixel-perfect, on-brand design built for speed, responsiveness, and a frictionless path to the CTA.' },
  { no: '04', title: 'Launch & Optimise', body: 'We ship, wire up tracking, and A/B test — continuously improving conversion rate and lowering your cost per lead.' },
];

// ── Portfolio / recent work ───────────────────────────────────
export const portfolio = [
  { tag: 'Landing Page', title: 'Education Lead-Gen Funnel', result: '-62% CPA', blurb: 'A benefit-driven page with streamlined forms outperformed the control and slashed cost per acquisition.', color: '#4F46E5' },
  { tag: 'Website',      title: 'GreenBuild Co. Redesign',   result: '2x Enquiries', blurb: 'Conversion-first rebuild cut bounce rate 40% and doubled monthly leads within the first month live.', color: '#8B5CF6' },
  { tag: 'Landing Page', title: 'D2C Product Launch',        result: '3x Leads', blurb: 'Message-matched campaign page tripled lead volume on the same Meta ad spend.', color: '#4169E1' },
  { tag: 'Website',      title: 'SaaS Marketing Site',       result: '+48% Signups', blurb: 'Fast, modern Next.js build with clear CTAs lifted trial signups by nearly half.', color: '#22C55E' },
];

// ── Testimonials ──────────────────────────────────────────────
export const testimonials = [
  { quote: 'The landing page they built dropped our cost per lead by more than half in the first two weeks. Our ads finally pay for themselves.', author: 'Priya Sharma', service: 'Landing Page', rating: 5 },
  { quote: 'The website is fast, beautiful, and generates leads on autopilot. Our enquiries doubled within the first month of going live.', author: 'Amit Patel', service: 'Website Development', rating: 5 },
  { quote: 'Turnaround was unbelievably quick and the conversion focus was obvious in every detail. Best marketing investment we have made.', author: 'Rajesh Kumar', service: 'Landing Page', rating: 5 },
  { quote: 'They rewrote our copy before touching the design, and that made all the difference. Same traffic, far more people actually filling the form.', author: 'Sneha Reddy', service: 'Landing Page', rating: 5 },
  { quote: 'Communication was clear from day one and we never had to chase for updates. The site went live on the date they promised.', author: 'Vikram Nair', service: 'Website Development', rating: 5 },
  { quote: 'Our old site took eight seconds to load on mobile. The new one is instant, and the bounce rate dropped off a cliff.', author: 'Ananya Iyer', service: 'Website Development', rating: 5 },
];

// ── FAQ ───────────────────────────────────────────────────────
export const faqs = [
  { q: 'How fast can my landing page go live?', a: 'A focused single-goal landing page typically goes live in 5–7 working days from our discovery call. Full websites usually take 3–5 weeks depending on scope.' },
  { q: "What's the difference between a landing page and a website?", a: 'A website tells your full story across many pages. A landing page is a single, distraction-free page built for one goal — ideal for paid ad campaigns because it matches your ad and converts at a much higher rate.' },
  { q: 'Will it work with my Google & Meta ads?', a: 'Yes. Every page is built ad-ready — fast loading, message-matched to your campaigns, with conversion tracking and lead capture wired in so you can measure ROI accurately.' },
  { q: 'Do I own everything you build?', a: 'Completely. There are no lock-ins and no hostage-ware. Once the project is delivered, all files, access, and assets are yours to keep.' },
  { q: 'How much does it cost?', a: 'Landing pages start at ₹3,999 and websites from ₹9,999. After a quick discovery call we send a fixed quote matched to your goals — no surprises.' },
  { q: 'What happens after launch?', a: 'We hand over tracking, offer post-launch support, and can run ongoing A/B tests to keep improving conversion rate and lowering your cost per lead over time.' },
];
