import Link from 'next/link';
import { services, projects } from '@/data/index.js';
import { getPostSummaries } from '@/lib/blog.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/site-map' });

export default function Page() {
  const posts = getPostSummaries();
  const groups = [
    {
      title: 'Main pages',
      links: [
        { href: '/', label: 'Home' },
        { href: '/projects', label: 'Projects' },
        { href: '/about', label: 'About us' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    { title: 'Services', links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.label })) },
    { title: 'Blog posts', links: posts.map((p) => ({ href: `/blog/${p.slug}`, label: p.title })) },
    {
      title: 'Client websites we built',
      links: projects.map((p) => ({ href: p.url, label: p.name, external: true })),
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy policy' },
        { href: '/terms', label: 'Terms and conditions' },
        { href: '/sitemap.xml', label: 'XML sitemap (for search engines)', plain: true },
      ],
    },
  ];

  return (
    <main className="sitemap-page">
      <JsonLd pathname="/site-map" />
      <header className="phead">
        <div className="container phead__grid phead__grid--single">
          <h1 className="phead__title">Site map</h1>
          <p className="lede phead__lede">Every page on this website, in one place.</p>
        </div>
      </header>
      <div className="container site-map">
        {groups.filter((g) => g.links.length).map((g) => (
          <section key={g.title} className="site-map__group">
            <h2 className="site-map__title">{g.title}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.href}>
                  {l.external || l.plain
                    ? <a href={l.href} className="link" {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label}</a>
                    : <Link href={l.href} className="link">{l.label}</Link>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
