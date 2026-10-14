import { useEffect, useState } from 'react';
import './Loader.css';

/* A short greeting on first load: "Hi" pops in, "Brands" follows,
   then the sheet lifts away. About a second in total. */
export default function Loader({ onComplete }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setExit(true), reduce ? 0 : 1000);
    const t2 = setTimeout(() => onComplete?.(), reduce ? 50 : 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`loader ${exit ? 'loader--exit' : ''}`} aria-hidden="true">
      <p className="loader__word">
        <span className="loader__hi">Hi</span>
        <span className="loader__brands">Brands</span>
      </p>
    </div>
  );
}
