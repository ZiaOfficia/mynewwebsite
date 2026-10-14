import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig, AnimatePresence, m } from 'framer-motion';
import Lenis from 'lenis';
import Loader        from './components/Loader/Loader.jsx';
import Header        from './components/Header/Header.jsx';
import Footer        from './components/Footer/Footer.jsx';
import EnquirePanel  from './components/EnquirePanel/EnquirePanel.jsx';
import { BookingProvider } from './components/BookingModal/BookingContext.jsx';
import Home       from './pages/Home.jsx';
import ServiceDetail  from './pages/ServiceDetail.jsx';
import AboutPage      from './pages/AboutPage.jsx';
import ProjectsPage   from './pages/ProjectsPage.jsx';
// Blog hidden for now — restore these imports with the routes below
// import BlogPage       from './pages/BlogPage.jsx';
// import BlogPostPage   from './pages/BlogPostPage.jsx';
import ContactPage    from './pages/ContactPage.jsx';
import SEO            from './seo/SEO.jsx';

/* useLayoutEffect logs a warning during renderToString — swap to useEffect
   on the server, where neither one runs anyway. */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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

/* ── Top scroll progress bar ─────────────────────────────── */
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

/* ── App Shell ─────────────────────────────────────────────── */
function AppShell() {
  const location = useLocation();
  return (
    <BookingProvider>
      <SmoothScroll />
      <ScrollProgress />
      <Header />
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
            <Route path="/projects"           element={<ProjectsPage />}  />
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
    <main className="notfound">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noindex
      />
      <div className="container notfound__inner">
        <p className="notfound__code" aria-hidden="true">404</p>
        <h1 className="t-1">This page isn't here.</h1>
        <p className="lede">It may have moved, or the link has a typo. The home page has everything we do.</p>
        <a href="/" className="btn btn--primary">Go to the home page</a>
      </div>
    </main>
  );
}

/* ── Root with Loader ───────────────────────────────────────
   Router-free so the same tree can mount under BrowserRouter
   (src/main.jsx) or StaticRouter (src/entry-server.jsx).

   The loader is skipped during prerendering: static HTML must
   contain the page content, not a splash screen. import.meta.env.SSR
   is statically replaced at build time, so the branch is compiled
   away in the client bundle.
   ──────────────────────────────────────────────────────────── */
export default function App() {
  /* Starts false so the client's first render matches the prerendered HTML
     exactly — a mismatch would make React throw away the static markup and
     re-render the whole tree. The loader is switched on in a layout effect,
     which runs after hydration but before paint, so it is never seen missing. */
  const [loading, setLoading] = useState(false);
  useIsomorphicLayoutEffect(() => { setLoading(true); }, []);

  return (
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
  );
}
