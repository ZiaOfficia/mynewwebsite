import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OfferBanner.css';

export default function OfferBanner() {
  const [hidden, setHidden] = useState(() => sessionStorage.getItem('offerBannerClosed') === '1');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* Pages read --offer-h (set via this class) to reserve space below the header */
  useEffect(() => {
    document.documentElement.classList.toggle('offer-visible', !hidden);
    return () => document.documentElement.classList.remove('offer-visible');
  }, [hidden]);

  if (hidden) return null;

  const goToOffer = () => {
    if (pathname === '/services/landing-pages') {
      const el = document.getElementById('pricing');
      if (el) window.__lenis ? window.__lenis.scrollTo(el, { offset: -90 }) : el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/services/landing-pages#pricing');
    }
  };

  const close = (e) => {
    e.stopPropagation();
    sessionStorage.setItem('offerBannerClosed', '1');
    setHidden(true);
  };

  return (
    <div
      className="offer-banner"
      onClick={goToOffer}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') goToOffer(); }}
    >
      <span className="offer-banner__text">
        <strong>OFFER LIVE:</strong> Landing Page at <b>₹3,999</b> <s>₹6,999</s>
      </span>
      <span className="offer-banner__ends">Ends soon — Claim now →</span>
      <button className="offer-banner__close" onClick={close} aria-label="Dismiss offer">&times;</button>
    </div>
  );
}
