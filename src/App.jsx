import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Loader     from './components/Loader/Loader.jsx';
import Header     from './components/Header/Header.jsx';
import Footer     from './components/Footer/Footer.jsx';
import Home       from './pages/Home.jsx';
import ServicesPage   from './pages/ServicesPage.jsx';
import AboutPage      from './pages/AboutPage.jsx';
import BlogPage       from './pages/BlogPage.jsx';
import BlogPostPage   from './pages/BlogPostPage.jsx';
import ContactPage    from './pages/ContactPage.jsx';

/* ── Scroll to top on route change ────────────────────────── */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* ── App Shell ─────────────────────────────────────────────── */
function AppShell() {
  return (
    <>
      <ScrollReset />
      <Header />
      <Routes>
        <Route path="/"                   element={<Home />}          />
        <Route path="/services"           element={<ServicesPage />}  />
        <Route path="/services/:slug"     element={<ServicesPage />}  />
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
