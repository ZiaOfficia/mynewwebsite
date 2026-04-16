import { useEffect, useState } from 'react';
import './Loader.css';
import { agency } from '../../data/index.js';

export default function Loader({ onComplete }) {
  const [phase, setPhase] = useState('fill'); // fill → hold → exit

  useEffect(() => {
    // Phase 1: fill bar
    const t1 = setTimeout(() => setPhase('hold'), 900);
    // Phase 2: exit loader
    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 1400);
    // Phase 3: unmount + reveal page
    const t3 = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className={`loader ${phase === 'exit' ? 'loader--exit' : ''}`}>
      {/* Background dots pattern */}
      <div className="loader__pattern" />

      {/* Content */}
      <div className="loader__inner">
        {/* Logo mark */}
        <div className="loader__logo">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <rect width="52" height="52" rx="6" fill="#C9A84C" />
            <text x="26" y="36" fontFamily="Georgia,serif" fontSize="28" fontWeight="700"
              fill="#0D1B2A" textAnchor="middle">
              {agency.name.charAt(0)}
            </text>
          </svg>
        </div>

        {/* Agency name */}
        <p className="loader__name">{agency.name}</p>

        {/* Progress bar */}
        <div className="loader__bar-track">
          <div className={`loader__bar-fill ${phase !== 'fill' ? 'loader__bar-fill--done' : ''}`} />
        </div>

        {/* Tagline */}
        <p className="loader__tagline">Digital Marketing</p>
      </div>

      {/* Bottom curtain that slides away */}
      <div className="loader__curtain" />
    </div>
  );
}
