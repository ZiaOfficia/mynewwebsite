import Link from 'next/link';

export const metadata = {
  title: { absolute: 'Page not found | HiBrands' },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="container notfound__inner">
        <p className="notfound__code" aria-hidden="true">404</p>
        <h1 className="t-1">This page isn't here.</h1>
        <p className="lede">It may have moved, or the link has a typo. The home page has everything we do.</p>
        <Link href="/" className="btn btn--primary">Go to the home page</Link>
      </div>
    </main>
  );
}
