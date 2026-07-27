'use client';

import { useState, useEffect } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { agency } from '../lib/data';

/* Minimal, distraction-free header for paid traffic: brand, a link across to
   the main site, and a single CTA. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lp-header ${scrolled ? 'lp-header--scrolled' : ''}`}>
      <div className="container lp-header__inner">
        <a href="#top" className="lp-logo" aria-label="HiBrands home">
          <span className="lp-logo__mark">
            H<span className="lp-logo__b">B</span>
          </span>
          <span className="lp-logo__wordmark">
            <span className="lp-logo__text">
              <span className="lp-logo__hi">Hi</span><span className="lp-logo__brands">Brands</span>
            </span>
            <span className="lp-logo__tagline">Say Hi to Growth.</span>
          </span>
        </a>

        <nav className="lp-header__nav">
          <a href={agency.site} className="lp-header__link">
            Main Website <RiExternalLinkLine size={15} />
          </a>
          <a href="#lead-form" className="sec-btn lp-header__cta">
            Get a Free Quote
          </a>
        </nav>
      </div>
    </header>
  );
}
