/* ============================================================
   DATA LAYER — Squareit Solutions
   ============================================================ */

// ── Agency Info ──────────────────────────────────────────────
export const agency = {
  name:        'Squareit Solutions',
  tagline:     'We Build. We Rank. We Grow.',
  description: 'Squareit Solutions is a performance-driven digital marketing agency helping businesses grow online through expert Website Development, SEO, Social Media Optimisation, and Google Ads management.',
  email:       'ss4526312@gmail.com',
  phone:       '+91 00000 00000',
  address:     'India',
  social: {
    instagram: 'https://www.instagram.com/',
    facebook:  'https://www.facebook.com/',
    twitter:   'https://twitter.com/',
    linkedin:  'https://www.linkedin.com/',
    youtube:   'https://www.youtube.com/',
  },
};

// ── Hero Cycling Words ────────────────────────────────────────
export const heroCycleWords = [
  'Rankings',
  'Revenue',
  'Website',
  'Brand',
  'Leads',
  'Business',
];

// ── Navigation ────────────────────────────────────────────────
export const navLinks = [
  {
    label: 'Services',
    href:  '/services',
    dropdown: [
      { label: 'Website Development', href: '/services/web-development',  desc: 'Fast, modern websites that convert' },
      { label: 'Landing Pages',       href: '/services/landing-pages',    desc: 'High-converting campaign pages'   },
      { label: 'SEO',                 href: '/services/seo',              desc: 'Rank higher on Google'            },
      { label: 'SMO',                 href: '/services/smo',              desc: 'Grow your social presence'        },
      { label: 'Google Ads',          href: '/services/google-ads',       desc: 'High-ROI paid campaigns'          },
    ],
  },
  { label: 'About',   href: '/about'   },
  { label: 'Blog',    href: '/blog'    },
  { label: 'Contact', href: '/contact' },
];

// ── Services ──────────────────────────────────────────────────
export const services = [
  {
    id:        'web-development',
    slug:      'web-development',
    icon:      '🖥️',
    label:     'Website Development',
    title:     'Website Development',
    tagline:   'Websites Built to Convert.',
    summary:   'We design and develop fast, mobile-first websites that look great, rank well, and turn visitors into customers — built on the latest tech stack tailored to your business goals.',
    description: `
      Your website is your most valuable digital asset. At Squareit Solutions, we design and develop
      custom websites that are not just visually stunning but are engineered for performance and conversions.

      Every site we build is fully responsive, lightning-fast, and structured with SEO best practices
      baked in from day one. Whether you need a brochure site, a service website, or a full-scale
      e-commerce platform, our team delivers pixel-perfect execution on time and within budget.

      We use modern technologies — React, WordPress, Webflow and more — to ensure your website
      is scalable, secure, and easy to manage. Post-launch, we provide full support to keep
      your website running at its best.
    `,
    features: [
      'Custom UI/UX Design',
      'Mobile-First & Responsive',
      'Speed & Core Web Vitals Optimised',
      'SEO-Ready Structure',
      'CMS / WordPress Integration',
      'Post-Launch Support',
    ],
    color: '#8B5CF6',
  },
  {
    id:        'landing-pages',
    slug:      'landing-pages',
    icon:      '🎯',
    label:     'Landing Pages',
    title:     'Landing Page Design',
    tagline:   'One Page. Maximum Conversions.',
    summary:   'We craft laser-focused landing pages that guide visitors towards a single action — generating leads, sign-ups, or sales — with persuasive copy and conversion-optimised design.',
    description: `
      A great landing page is the backbone of every successful ad campaign or lead generation effort.
      At Squareit Solutions, we build landing pages that are purpose-built to convert.

      From compelling headlines and benefit-driven copy to strategic CTAs and trust signals, every
      element is designed with your target audience in mind. We A/B test layouts and messaging
      to continuously improve conversion rates and lower your cost per lead.

      Whether it's for Google Ads, Meta campaigns, or organic traffic, our landing pages deliver
      measurable results — more enquiries, more bookings, and more sales for your business.
    `,
    features: [
      'Conversion-Focused Design',
      'Persuasive Copywriting',
      'A/B Testing Ready',
      'Mobile Optimised',
      'Fast Load Times',
      'Lead Capture Integration',
    ],
    color: '#C9A84C',
  },
  {
    id:        'seo',
    slug:      'seo',
    icon:      '🔍',
    label:     'SEO',
    title:     'Search Engine Optimisation',
    tagline:   'Rank #1. Stay There.',
    summary:   'Our data-driven SEO strategies put your business in front of the right people at the right time — driving consistent organic traffic that grows month on month.',
    description: `
      Search Engine Optimisation is the most sustainable way to grow your online presence.
      At Squareit Solutions, we take a comprehensive approach to SEO — combining technical excellence,
      content strategy, and authority building to deliver lasting rankings.

      We begin with a deep-dive audit of your website, identifying technical gaps, content opportunities,
      and quick wins. From there, we execute a tailored strategy covering on-page optimisation, keyword
      targeting, structured data, site speed, and a robust link-building campaign.

      Our transparent monthly reports keep you fully informed of your rankings, traffic, and ROI —
      so you always know exactly what your investment is delivering.
    `,
    features: [
      'Technical SEO Audit',
      'On-Page Optimisation',
      'Off-Page & Link Building',
      'Keyword Strategy & Research',
      'Local SEO & Google Business',
      'Monthly Ranking Reports',
    ],
    color: '#C9A84C',
  },
  {
    id:        'smo',
    slug:      'smo',
    icon:      '📣',
    label:     'SMO',
    title:     'Social Media Optimisation',
    tagline:   'Turn Followers Into Customers.',
    summary:   'We build and manage your brand\'s social media presence with engaging content, community management, and strategic growth tactics across all major platforms.',
    description: `
      Social media is where your customers spend their time — and we make sure your brand shows up
      impressively. Squareit Solutions provides full-service social media optimisation to grow your
      following, drive engagement, and convert fans into loyal customers.

      We create platform-specific content calendars, design eye-catching creatives, manage your
      community interactions, and run targeted social campaigns. From Instagram and Facebook to
      LinkedIn and YouTube, we tailor every piece of content to resonate with your audience.

      Our SMO service is backed by analytics — we track performance, learn what works, and
      continuously refine your social strategy for maximum impact.
    `,
    features: [
      'Profile Optimisation',
      'Content Calendar & Creatives',
      'Community Management',
      'Influencer Outreach',
      'Social Analytics & Reporting',
      'Paid Social Integration',
    ],
    color: '#3B82F6',
  },
  {
    id:        'google-ads',
    slug:      'google-ads',
    icon:      '📈',
    label:     'Google Ads',
    title:     'Google Ads Management',
    tagline:   'Every Rupee, Counted.',
    summary:   'We manage high-performance Google Ads campaigns that drive targeted traffic, qualified leads, and measurable ROI — with full transparency and no wasted spend.',
    description: `
      Google Ads is the fastest way to put your business in front of high-intent customers actively
      searching for what you offer. At Squareit Solutions, we manage campaigns that are meticulously
      optimised to maximise your return on every rupee spent.

      From keyword research and compelling ad copy to bid strategy, audience targeting, and
      conversion tracking — we handle every aspect of your Google Ads account. We manage
      Search, Display, Shopping, YouTube, and Performance Max campaigns.

      You'll receive detailed monthly reports showing exactly how your budget is being spent,
      which campaigns are performing, and where we're improving — complete transparency,
      no surprises.
    `,
    features: [
      'Google Search Campaigns',
      'Display & Remarketing',
      'Shopping & Performance Max',
      'Conversion Tracking Setup',
      'Competitor & Keyword Research',
      'Detailed Monthly Reports',
    ],
    color: '#EF4444',
  },
];

// ── Stats / Numbers ───────────────────────────────────────────
export const stats = [
  { value: '150',  suffix: '+', label: 'Projects Delivered'  },
  { value: '95',   suffix: '%', label: 'Client Retention'    },
  { value: '3.5',  suffix: 'x', label: 'Average ROI'         },
  { value: '20',   suffix: '+', label: 'Team Members'        },
];

// ── Why Us / USPs ─────────────────────────────────────────────
export const whyUs = [
  {
    icon:  '🎯',
    title: 'Results-First Approach',
    body:  'Everything we do is tied to measurable outcomes — more traffic, more leads, more revenue. We set clear KPIs from day one and report against them every month.',
  },
  {
    icon:  '🤝',
    title: 'Dedicated Account Manager',
    body:  'You\'ll always have a single point of contact who knows your business inside out. No passing between departments — just direct, responsive communication.',
  },
  {
    icon:  '🔄',
    title: 'Transparent Reporting',
    body:  'We believe you should know exactly what\'s happening with your campaigns. Our detailed monthly reports cover every metric that matters to your growth.',
  },
  {
    icon:  '⚡',
    title: 'Agile & Fast Execution',
    body:  'Digital moves fast and so do we. Our team executes quickly, adapts to market changes, and continuously optimises your campaigns for peak performance.',
  },
];

// ── Team ──────────────────────────────────────────────────────
export const team = [
  {
    id:    1,
    name:  'Founder & CEO',
    role:  'Founder & CEO',
    bio:   'Visionary leader with deep expertise in digital marketing strategy, passionate about helping Indian businesses scale online.',
    image: null,
  },
  {
    id:    2,
    name:  'SEO Head',
    role:  'Head of SEO',
    bio:   'Technical SEO specialist with a proven track record of ranking competitive keywords and driving sustainable organic growth.',
    image: null,
  },
  {
    id:    3,
    name:  'Social Media Lead',
    role:  'Social Media Lead',
    bio:   'Creative strategist behind our clients\' social success — from viral content ideas to community engagement that converts.',
    image: null,
  },
  {
    id:    4,
    name:  'PPC Specialist',
    role:  'Google Ads Specialist',
    bio:   'Certified Google Ads expert obsessed with optimising campaigns for the lowest cost per acquisition and highest ROAS.',
    image: null,
  },
];

// ── Testimonials ──────────────────────────────────────────────
export const testimonials = [
  {
    id:      1,
    quote:   'Squareit Solutions completely transformed our online presence. Within 4 months, our organic traffic tripled and we\'re now ranking on page 1 for all our target keywords. Best investment we\'ve made.',
    author:  'Rajesh Kumar',
    company: 'TechStart India',
    service: 'SEO',
    rating:  5,
  },
  {
    id:      2,
    quote:   'Our Google Ads ROAS went from 1.2x to 4.8x in just 3 months after switching to Squareit Solutions. The team is transparent, proactive, and genuinely understands performance marketing.',
    author:  'Priya Sharma',
    company: 'StyleHub',
    service: 'Google Ads',
    rating:  5,
  },
  {
    id:      3,
    quote:   'The website they built for us is fast, beautiful, and generates leads on autopilot. Our enquiries doubled within the first month of going live. Highly recommend their web team.',
    author:  'Amit Patel',
    company: 'GreenBuild Co.',
    service: 'Website Development',
    rating:  5,
  },
];

// ── Clients / Logos ───────────────────────────────────────────
export const clients = [
  { id: 1, name: 'TechStart India', logo: null },
  { id: 2, name: 'StyleHub',        logo: null },
  { id: 3, name: 'GreenBuild Co.',  logo: null },
  { id: 4, name: 'HealthFirst',     logo: null },
  { id: 5, name: 'EduVision',       logo: null },
  { id: 6, name: 'RetailEdge',      logo: null },
];

// ── Blog Posts ────────────────────────────────────────────────
export const blogCategories = [
  'All',
  'SEO',
  'Social Media',
  'Google Ads',
  'Web Design',
  'Digital Marketing',
];

export const blogPosts = [
  {
    id:         1,
    slug:       'seo-mistakes-killing-rankings',
    title:      '10 SEO Mistakes That Are Silently Killing Your Google Rankings',
    excerpt:    'Most businesses unknowingly sabotage their own SEO with these common mistakes. Find out what they are and exactly how to fix them before they cost you more traffic.',
    category:   'SEO',
    author:     'Squareit Solutions',
    date:       '2024-03-10',
    readTime:   '6 min read',
    image:      null,
    featured:   true,
    tags:       ['SEO', 'Technical SEO', 'Rankings'],
    content:    `
## Introduction

If your website isn't ranking where you want it to, chances are you're making one or more of these common SEO mistakes. The good news? Every single one of them is fixable.

## 1. Ignoring Core Web Vitals

Google now uses page experience signals as a ranking factor. If your site is slow or has layout shifts, it will rank lower than competitors with better performance scores.

## 2. Keyword Stuffing

Cramming keywords unnaturally into your content is a classic mistake that can actually trigger Google penalties. Focus on natural, helpful content instead.

## 3. Missing or Duplicate Meta Descriptions

Every page needs a unique, compelling meta description. It directly impacts your click-through rate from search results.

## 4. No Internal Linking Strategy

Internal links help Google understand your site structure and distribute authority. Without them, your key pages don't get the ranking power they deserve.

## Key Takeaways

- Fix Core Web Vitals to boost your page experience score
- Write naturally — keywords should support content, not dominate it
- Audit your meta tags regularly for duplicates and missing entries
- Build a deliberate internal linking structure across your site

## Conclusion

SEO success comes from getting the fundamentals right. Audit your site today against these points and you'll see meaningful improvements within weeks.
    `,
  },
  {
    id:         2,
    slug:       'google-ads-roas-increase',
    title:      'How to Double Your Google Ads ROAS Without Increasing Your Budget',
    excerpt:    'Getting more from your Google Ads spend doesn\'t always mean spending more. These proven optimisation tactics will help you squeeze maximum ROI from every rupee.',
    category:   'Google Ads',
    author:     'Squareit Solutions',
    date:       '2024-03-22',
    readTime:   '7 min read',
    image:      null,
    featured:   false,
    tags:       ['Google Ads', 'PPC', 'ROAS'],
    content:    'Detailed guide on improving Google Ads ROAS through smart optimisation — covering negative keywords, ad copy testing, audience layering, and bid strategies.',
  },
  {
    id:         3,
    slug:       'landing-page-conversion-tips',
    title:      '7 Landing Page Elements That Dramatically Increase Conversions',
    excerpt:    'Your ad might be perfect but if your landing page isn\'t optimised, you\'re burning budget. Here are the 7 elements every high-converting landing page must have.',
    category:   'Web Design',
    author:     'Squareit Solutions',
    date:       '2024-04-05',
    readTime:   '5 min read',
    image:      null,
    featured:   false,
    tags:       ['Landing Pages', 'CRO', 'Web Design'],
    content:    'A deep-dive into conversion rate optimisation for landing pages — covering headline frameworks, trust signals, CTA placement, form design, and page speed.',
  },
  {
    id:         4,
    slug:       'instagram-growth-strategy-2024',
    title:      'The Instagram Growth Strategy That\'s Actually Working in 2024',
    excerpt:    'Organic reach is declining but these proven Instagram strategies are still delivering real follower growth and engagement for brands in any niche.',
    category:   'Social Media',
    author:     'Squareit Solutions',
    date:       '2024-04-18',
    readTime:   '8 min read',
    image:      null,
    featured:   false,
    tags:       ['Instagram', 'SMO', 'Social Media'],
    content:    'A comprehensive guide to growing on Instagram organically in 2024 — covering Reels strategy, hashtag research, collaboration tactics, and profile optimisation.',
  },
  {
    id:         5,
    slug:       'local-seo-guide-india',
    title:      'Local SEO in India: The Complete Guide to Dominating Google Maps',
    excerpt:    'If your business serves a local area, ranking on Google Maps can be your single biggest source of new customers. Here\'s exactly how to do it.',
    category:   'SEO',
    author:     'Squareit Solutions',
    date:       '2024-05-02',
    readTime:   '9 min read',
    image:      null,
    featured:   false,
    tags:       ['Local SEO', 'Google Maps', 'Google Business'],
    content:    'Step-by-step local SEO guide for Indian businesses — covering Google Business Profile optimisation, citation building, review strategy, and local keyword targeting.',
  },
  {
    id:         6,
    slug:       'website-speed-seo-impact',
    title:      'Website Speed & SEO: Why Slow Sites Are Losing Customers Every Day',
    excerpt:    'Every second of load time costs you conversions and rankings. Learn how to diagnose your site\'s speed issues and fix them without a full redesign.',
    category:   'Web Design',
    author:     'Squareit Solutions',
    date:       '2024-05-15',
    readTime:   '6 min read',
    image:      null,
    featured:   false,
    tags:       ['Web Design', 'Speed', 'Core Web Vitals'],
    content:    'Technical guide on improving website speed — covering image optimisation, caching, CDN setup, code minification, and how speed directly impacts your Google rankings.',
  },
];

// ── Case Studies ──────────────────────────────────────────────
export const caseStudies = [
  {
    id:       1,
    slug:     'techstart-seo-case-study',
    client:   'TechStart India',
    service:  'SEO',
    title:    'How We Grew TechStart India\'s Organic Traffic by 312%',
    summary:  'Through technical SEO, content strategy, and authority building, we took TechStart from page 5 to position 1 for their core keywords in 6 months.',
    result:   '+312% Organic Traffic',
    duration: '6 Months',
    image:    null,
  },
  {
    id:       2,
    slug:     'stylehub-google-ads-case-study',
    client:   'StyleHub',
    service:  'Google Ads',
    title:    'Taking StyleHub\'s Google Ads ROAS from 1.2x to 4.8x',
    summary:  'A complete overhaul of StyleHub\'s Google Ads account — restructuring campaigns, refining audiences, and optimising bids — delivered a 4x improvement in ROAS.',
    result:   '4.8x ROAS',
    duration: '3 Months',
    image:    null,
  },
  {
    id:       3,
    slug:     'greenbuild-website-case-study',
    client:   'GreenBuild Co.',
    service:  'Website Development',
    title:    'A New Website That Doubled GreenBuild\'s Monthly Enquiries',
    summary:  'We redesigned GreenBuild\'s website with a conversion-first approach — improving UX, load speed, and clear CTAs — resulting in double the lead volume in month one.',
    result:   '2x Enquiries',
    duration: '4 Weeks',
    image:    null,
  },
];

// ── FAQ ───────────────────────────────────────────────────────
export const faqs = [
  {
    question: 'How long before I see results from SEO?',
    answer:   'SEO is a long-term investment. Most clients start seeing meaningful improvements in rankings and traffic within 3–6 months. For competitive industries it can take longer, but the results are sustainable and compound over time — unlike paid ads.',
  },
  {
    question: 'What is your minimum budget for Google Ads?',
    answer:   'We typically recommend a minimum ad spend of ₹15,000–₹20,000 per month to generate meaningful data and results. Our management fee is separate. We\'ll always recommend a budget aligned to your goals and market competitiveness.',
  },
  {
    question: 'Do you work with businesses outside India?',
    answer:   'Yes! While we are based in India, we work with businesses across the globe. Our team is experienced in international SEO, multi-region Google Ads campaigns, and global social media strategies.',
  },
  {
    question: 'How do you report on campaign performance?',
    answer:   'We provide detailed monthly reports covering all key metrics — rankings, organic traffic, ad spend, conversions, ROAS, and more. We also schedule monthly calls to walk you through the results and plan the next steps together.',
  },
  {
    question: 'Can I bundle services together?',
    answer:   'Absolutely. Many of our clients use multiple services — for example, Website Development + SEO, or Google Ads + Landing Pages. Bundling services often delivers better results as everything works together, and we offer package discounts for combined services.',
  },
  {
    question: 'How do you build a website — and how long does it take?',
    answer:   'We start with a detailed discovery session to understand your goals and target audience. From there we design, build, test, and launch your site. A standard website typically takes 3–5 weeks; larger projects may take longer. We use platforms like React, WordPress, and Webflow depending on your needs.',
  },
];

// ── Packages / Pricing ────────────────────────────────────────
export const packages = [
  {
    id:       'starter',
    name:     'Starter',
    price:    '₹14,999',
    period:   '/month',
    tagline:  'For small businesses getting started online',
    features: [
      'SEO — Up to 10 Keywords',
      'Social Media (2 Platforms)',
      '8 Social Media Posts/Month',
      'Monthly Performance Report',
      'Email Support',
    ],
    cta:      'Get Started',
    popular:  false,
  },
  {
    id:       'growth',
    name:     'Growth',
    price:    '₹29,999',
    period:   '/month',
    tagline:  'For growing businesses ready to scale',
    features: [
      'Everything in Starter',
      'SEO — Up to 25 Keywords',
      'Google Ads Management (up to ₹50k spend)',
      'Social Media (3 Platforms)',
      '16 Social Media Posts/Month',
      'Bi-Weekly Strategy Calls',
      'Dedicated Account Manager',
    ],
    cta:      'Get Started',
    popular:  true,
  },
  {
    id:       'enterprise',
    name:     'Enterprise',
    price:    'Custom',
    period:   '',
    tagline:  'For established businesses with aggressive growth goals',
    features: [
      'Everything in Growth',
      'Unlimited SEO Keywords',
      'Google Ads — Unlimited Spend',
      'Landing Page Development',
      'Website Maintenance',
      'Priority Support & Weekly Calls',
      'Dedicated Senior Strategist',
    ],
    cta:      'Contact Us',
    popular:  false,
  },
];
