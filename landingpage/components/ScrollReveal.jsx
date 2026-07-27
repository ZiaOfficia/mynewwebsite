'use client';

import { useEffect } from 'react';

/* Adds `is-visible` to any `.nh-reveal` / `.nh-reveal-left` element once it
   scrolls into view — the same reveal pattern used across the main site.
   Mounted once at the page root so server-rendered sections stay static. */
export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal, .nh-reveal-left');
    if (!els.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
