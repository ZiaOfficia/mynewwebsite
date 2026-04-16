import { useRef, useEffect, useState } from 'react';
import './Stats.css';
import { stats } from '../../data/index.js';

/* Simple counter animation hook */
function useCountUp(target, duration = 1800, isActive = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const num = parseInt(target.replace(/\D/g, ''), 10) || 0;
    if (num === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isActive, target, duration]);
  return count;
}

function StatItem({ stat, isActive }) {
  const num = useCountUp(stat.value, 1800, isActive);
  const raw = stat.value.replace(/\D/g, '');
  const display = raw ? num.toLocaleString() : stat.value;
  return (
    <div className="stats__item">
      <div className="stats__value">
        {display}<span className="stats__suffix">{stat.suffix}</span>
      </div>
      <p className="stats__label">{stat.label}</p>
    </div>
  );
}

export default function Stats() {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section section section--navy" ref={ref}>
      <div className="stats-section__pattern" />
      <div className="container">
        <div className="stats-section__inner">
          {/* Left copy */}
          <div className="stats-section__copy">
            <p className="section-label">Our Impact</p>
            <h2 className="display-md stats-section__heading">
              Numbers that speak<br />for themselves
            </h2>
            <p className="body-md stats-section__sub">
              Placeholder paragraph about your agency's achievements and
              track record. Keep this to 2 sentences.
            </p>
          </div>

          {/* Stats grid */}
          <div className="stats-section__grid">
            {stats.map((s) => (
              <StatItem key={s.label} stat={s} isActive={isActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
