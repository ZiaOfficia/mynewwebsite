import { useEffect, useState } from 'react';
import './Loader.css';

const WORDS = [
  { text: 'Hi',     cls: 'loader__word--hi' },
  { text: 'Brands', cls: 'loader__word--brands' },
];

export default function Loader({ onComplete }) {
  const [phase, setPhase] = useState('fill'); // fill → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 2500);
    const t2 = setTimeout(() => onComplete?.(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  let letterIndex = 0;
  return (
    <div className={`loader ${phase === 'exit' ? 'loader--exit' : ''}`}>
      {/* Background dots pattern */}
      <div className="loader__pattern" />

      {/* Content */}
      <div className="loader__inner">
        {/* HB monogram */}
        <div className="loader__monogram" aria-hidden="true">
          <span className="loader__monogram-h">H</span>
          <span className="loader__monogram-b">B</span>
        </div>

        {/* Wordmark — letters rise beneath the monogram */}
        <h1 className="loader__name" aria-label="Hi Brands">
          {WORDS.map((word) => (
            <span key={word.text} className={`loader__word ${word.cls}`}>
              {[...word.text].map((ch, i) => (
                <span
                  key={i}
                  className="loader__letter"
                  style={{ animationDelay: `${0.45 + letterIndex++ * 0.07}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Progress bar */}
        <div className="loader__bar-track">
          <div className="loader__bar-fill" />
        </div>

        {/* Tagline */}
        <p className="loader__tagline">Say Hi to Growth</p>
      </div>

      {/* Bottom curtain that slides away */}
      <div className="loader__curtain" />
    </div>
  );
}
