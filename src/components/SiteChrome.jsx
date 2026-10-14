'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Loader from './Loader/Loader.jsx';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* Smooth scrolling, the top progress line, and the short greeting
   shown once per visit. Everything here is client-only polish. */
export default function SiteChrome() {
  const bar = useRef(null);
  const [greeting, setGreeting] = useState(false);

  useIsoLayoutEffect(() => {
    try {
      if (!sessionStorage.getItem('hb-greeted')) {
        sessionStorage.setItem('hb-greeted', '1');
        setGreeting(true);
      }
    } catch { /* storage blocked: skip the greeting */ }
  }, []);

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

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
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

  return (
    <>
      {greeting && <Loader onComplete={() => setGreeting(false)} />}
      <div ref={bar} className="scroll-progress" style={{ transform: 'scaleX(0)' }} />
    </>
  );
}
