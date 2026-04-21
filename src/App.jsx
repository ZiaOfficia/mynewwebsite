import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Loader     from './components/Loader/Loader.jsx';
import Header     from './components/Header/Header.jsx';
import Footer     from './components/Footer/Footer.jsx';
import Home       from './pages/Home.jsx';
import ServicesPage   from './pages/ServicesPage.jsx';
import ServiceDetail  from './pages/ServiceDetail.jsx';
import AboutPage      from './pages/AboutPage.jsx';
import BlogPage       from './pages/BlogPage.jsx';
import BlogPostPage   from './pages/BlogPostPage.jsx';
import ContactPage    from './pages/ContactPage.jsx';

/* ── Page accent colours (must match each page's theme) ──── */
const PAGE_COLORS = {
  '/':                         { hex: '#CC1F35', rgb: '204,31,53'   },
  '/services':                 { hex: '#6366F1', rgb: '99,102,241'  },
  '/services/web-development': { hex: '#8B5CF6', rgb: '139,92,246'  },
  '/services/landing-pages':   { hex: '#06B6D4', rgb: '6,182,212'   },
  '/services/seo':             { hex: '#22C55E', rgb: '34,197,94'   },
  '/services/smo':             { hex: '#EC4899', rgb: '236,72,153'  },
  '/services/google-ads':      { hex: '#1A73E8', rgb: '26,115,232'  },
  '/about':                    { hex: '#F97316', rgb: '249,115,22'  },
  '/blog':                     { hex: '#0EA5E9', rgb: '14,165,233'  },
  '/contact':                  { hex: '#D946EF', rgb: '217,70,239'  },
};
const DEFAULT_COLOR = PAGE_COLORS['/'];

function getPageColor(pathname) {
  if (PAGE_COLORS[pathname]) return PAGE_COLORS[pathname];
  /* match /blog/:slug → blog colour, /services/:slug → service colour via data */
  if (pathname.startsWith('/blog/'))     return PAGE_COLORS['/blog'];
  if (pathname.startsWith('/services/')) return PAGE_COLORS['/services'];
  return DEFAULT_COLOR;
}

/* ── Scroll to top on route change ────────────────────────── */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* ── Injects --page-accent on every route change ─────────── */
function PageAccentInjector() {
  const { pathname } = useLocation();
  useEffect(() => {
    const { hex, rgb } = getPageColor(pathname);
    document.documentElement.style.setProperty('--page-accent',     hex);
    document.documentElement.style.setProperty('--page-accent-rgb', rgb);
  }, [pathname]);
  return null;
}

/* ── App Shell ─────────────────────────────────────────────── */
function AppShell() {
  return (
    <>
      <ScrollReset />
      <PageAccentInjector />
      <Header />
      <Routes>
        <Route path="/"                   element={<Home />}          />
        <Route path="/services"           element={<ServicesPage />}  />
        <Route path="/services/:slug"     element={<ServiceDetail />}  />
        <Route path="/about"              element={<AboutPage />}     />
        <Route path="/blog"               element={<BlogPage />}      />
        <Route path="/blog/:slug"         element={<BlogPostPage />}  />
        <Route path="/contact"            element={<ContactPage />}   />
        {/* Fallback */}
        <Route path="*"                   element={<NotFound />}      />
      </Routes>
      <Footer />
    </>
  );
}

/* ── 404 ───────────────────────────────────────────────────── */
function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '1.5rem',
      padding: '2rem',
      background: 'var(--navy)',
    }}>
      <span style={{ fontSize: '4rem' }}>🔍</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,6vw,4.5rem)', color: 'var(--white)' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 420, fontSize: '1.05rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        Back to Home
      </a>
    </main>
  );
}

/* ── Root with Loader ──────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      {/* Page content fades in once loader exits */}
      <div style={{
        opacity: loading ? 0 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: loading ? 'none' : 'auto',
      }}>
        <AppShell />
      </div>
    </BrowserRouter>
  );
}
