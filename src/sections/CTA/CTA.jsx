'use client';

import { agency } from '../../data/index.js';
import { useBooking } from '../../components/BookingModal/BookingContext.jsx';

/* Closing band used at the foot of every page. */
export default function CTA({
  title = "Talk to the engineer who'll do the work.",
  sub   = 'A free call, no obligation. Tell us what you need and get an honest answer on time and price.',
}) {
  const { openBooking } = useBooking();
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <h2 className="t-1 cta-band__title">{title}</h2>
        <div className="cta-band__side">
          <p>{sub}</p>
          <div className="cta-band__ctas">
            <button type="button" className="btn btn--ink" onClick={openBooking}>Book a free call</button>
            <a href={`tel:${agency.phone.replace(/\s/g, '')}`} className="cta-band__phone">or call {agency.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
