import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import { agency, navLinks } from '../../data/index.js';

export default function Header() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeDD, setActiveDD]   = useState(null); // dropdown label
  const location = useLocation();
  const timerRef = useRef(null);

  // Scroll detection → add shadow/bg
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setActiveDD(null);
  }, [location]);

  // Dropdown hover helpers
  const openDD  = (label) => { clearTimeout(timerRef.current); setActiveDD(label); };
  const closeDD = ()      => { timerRef.current = setTimeout(() => setActiveDD(null), 120); };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--open' : ''}`}>
      <div className="header__inner container">

        {/* ── Logo ── */}
        <Link to="/" className="header__logo">
          <span className="header__logo-mark">
            {agency.name.charAt(0)}
          </span>
          <span className="header__logo-text">{agency.name}</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className={`header__nav-item ${link.dropdown ? 'header__nav-item--has-dd' : ''}`}
                onMouseEnter={() => link.dropdown && openDD(link.label)}
                onMouseLeave={() => link.dropdown && closeDD()}
              >
                {link.dropdown ? (
                  <>
                    <button
                      className="header__nav-link header__nav-link--btn"
                      aria-expanded={activeDD === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <svg className="header__nav-chevron" width="10" height="6" viewBox="0 0 10 6">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div
                      className={`header__dropdown ${activeDD === link.label ? 'header__dropdown--open' : ''}`}
                      onMouseEnter={() => openDD(link.label)}
                      onMouseLeave={() => closeDD()}
                    >
                      <div className="header__dropdown-inner">
                        {link.dropdown.map((item) => (
                          <Link key={item.label} to={item.href} className="header__dd-item">
                            <span className="header__dd-label">{item.label}</span>
                            <span className="header__dd-desc">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ── CTA ── */}
        <div className="header__actions">
          <Link to="/contact" className="btn btn-primary header__cta">
            Get a Free Audit
          </Link>
        </div>

        {/* ── Hamburger ── */}
        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
        <nav className="header__mobile-nav">
          {navLinks.map((link) => (
            <div key={link.label} className="header__mobile-group">
              {link.dropdown ? (
                <>
                  <button
                    className="header__mobile-link header__mobile-link--parent"
                    onClick={() => setActiveDD(activeDD === link.label ? null : link.label)}
                  >
                    {link.label}
                    <svg
                      className={`header__mobile-chevron ${activeDD === link.label ? 'rotated' : ''}`}
                      width="12" height="8" viewBox="0 0 12 8"
                    >
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {activeDD === link.label && (
                    <div className="header__mobile-submenu">
                      {link.dropdown.map((item) => (
                        <Link key={item.label} to={item.href} className="header__mobile-sublink">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </div>
          ))}
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
            Get a Free Audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
