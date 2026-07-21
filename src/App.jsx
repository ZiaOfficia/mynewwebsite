import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig, AnimatePresence, m } from 'framer-motion';
import Lenis from 'lenis';
import Loader        from './components/Loader/Loader.jsx';
import Header        from './components/Header/Header.jsx';
import Footer        from './components/Footer/Footer.jsx';
import EnquirePanel  from './components/EnquirePanel/EnquirePanel.jsx';
import { BookingProvider } from './components/BookingModal/BookingContext.jsx';
import OfferBanner from './components/OfferBanner/OfferBanner.jsx';
import Home       from './pages/Home.jsx';
import ServiceDetail  from './pages/ServiceDetail.jsx';
import AboutPage      from './pages/AboutPage.jsx';
// Blog hidden for now — restore these imports with the routes below
// import BlogPage       from './pages/BlogPage.jsx';
// import BlogPostPage   from './pages/BlogPostPage.jsx';
import ContactPage    from './pages/ContactPage.jsx';

/* ── Page accent colours (must match each page's theme) ──── */
const PAGE_COLORS = {
  '/':                         { hex: '#CC1F35', rgb: '204,31,53'   },
  '/services':                 { hex: '#6366F1', rgb: '99,102,241'  },
  '/services/web-development': { hex: '#8B5CF6', rgb: '139,92,246'  },
  '/services/landing-pages':   { hex: '#4F46E5', rgb: '79,70,229'   },
  '/services/seo':             { hex: '#22C55E', rgb: '34,197,94'   },
  '/services/smo':             { hex: '#1877F2', rgb: '24,119,242'  },
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

/* ── Buttery smooth scrolling (off for reduced motion) ────── */
function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.12 });
    window.__lenis = lenis;
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = undefined; };
  }, []);
  return null;
}

/* ── Top scroll progress bar — red into royal blue ────────── */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" style={{ transform: 'scaleX(0)' }} />;
}

/* ── Royal-blue last letter on headings that open with the red
      first letter (Home opts out of the red first letter) ──── */
const ACCENT_HEADINGS =
  '.nh-hero__heading, .sec-heading--dark, .sec-heading--light, ' +
  '.sec-cta__heading, .sec-confidence__top-line, .sec-confidence__bottom-line';

function RoyalLastLetter() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/') return;
    /* delay > page-transition exit so the new page's DOM is mounted */
    const id = setTimeout(() => {
      document.querySelectorAll(ACCENT_HEADINGS).forEach((el) => {
        if (el.closest('.home-page') || el.querySelector('.accent-last')) return;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let last = null;
        while (walker.nextNode()) {
          if (walker.currentNode.textContent.trim()) last = walker.currentNode;
        }
        if (!last) return;
        const m = last.textContent.match(/^([\s\S]*?)([A-Za-z0-9][^A-Za-z0-9]*)$/);
        if (!m) return;
        const span = document.createElement('span');
        span.className = 'accent-last';
        span.textContent = m[2];
        last.textContent = m[1];
        last.parentNode.insertBefore(span, last.nextSibling);
      });
    }, 450);
    return () => clearTimeout(id);
  }, [pathname]);
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
  const location = useLocation();
  return (
    <BookingProvider>
      <PageAccentInjector />
      <RoyalLastLetter />
      <SmoothScroll />
      <ScrollProgress />
      <Header />
      <OfferBanner />
      <EnquirePanel />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        <m.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Routes location={location}>
            <Route path="/"                   element={<Home />}          />
            <Route path="/services"           element={<Navigate to="/" replace />} />
            <Route path="/services/:slug"     element={<ServiceDetail />}  />
            <Route path="/about"              element={<AboutPage />}     />
            {/* Blog hidden for now — restore when ready
            <Route path="/blog"               element={<BlogPage />}      />
            <Route path="/blog/:slug"         element={<BlogPostPage />}  /> */}
            <Route path="/contact"            element={<ContactPage />}   />
            {/* Fallback */}
            <Route path="*"                   element={<NotFound />}      />
          </Routes>
        </m.div>
      </AnimatePresence>
      <Footer />
    </BookingProvider>
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
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          {loading && <Loader onComplete={() => setLoading(false)} />}
          {/* Page content fades in once loader exits */}
          <div style={{
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: loading ? 'none' : 'auto',
          }}>
            <AppShell />
          </div>
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  );
}
