import { agency } from '../lib/data';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="lp-footer">
      <div className="container lp-footer__inner">
        <div className="lp-logo">
          <span className="lp-logo__mark">H<span className="lp-logo__b">B</span></span>
          <span className="lp-logo__wordmark">
            <span className="lp-logo__text">
              <span className="lp-logo__hi">Hi</span><span className="lp-logo__brands">Brands</span>
            </span>
            <span className="lp-logo__tagline">Say Hi to Growth.</span>
          </span>
        </div>
        <p className="lp-footer__copy">© {year} {agency.name}. {agency.tagline}</p>
        <nav className="lp-footer__links">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#faq">FAQ</a>
          <a href="#lead-form">Get a Quote</a>
        </nav>
      </div>
    </footer>
  );
}
