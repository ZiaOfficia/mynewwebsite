import { RiSparkling2Fill } from 'react-icons/ri';

/* Scrolling trust ticker — pure CSS animation, no JS. */
const ITEMS = ['MORE LEADS', 'LOWER CPA', 'FASTER SITES', 'HIGHER ROI', 'BUILT TO CONVERT', 'AD-READY', 'NO LOCK-INS', 'FAST TURNAROUND'];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="lp-marquee" aria-hidden="true">
      <div className="lp-marquee__track">
        {doubled.map((txt, i) => (
          <span key={i} className="lp-marquee__item">
            <span className="lp-marquee__text">{txt}</span>
            <RiSparkling2Fill className="lp-marquee__sep" size={14} />
          </span>
        ))}
      </div>
    </div>
  );
}
