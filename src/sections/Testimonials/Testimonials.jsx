import { useState } from 'react';
import './Testimonials.css';
import { testimonials } from '../../data/index.js';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((i) => (i + 1) % testimonials.length);

  const t = testimonials[active];

  return (
    <section className="testimonials section section--off-white">
      <div className="container">

        {/* Header */}
        <div className="testimonials__header">
          <p className="section-label">Client Love</p>
          <h2 className="display-md">What our clients say</h2>
        </div>

        {/* Slider */}
        <div className="testimonials__slider">
          <div className="testimonials__quote-mark">"</div>

          <div className="testimonials__body" key={active}>
            <p className="testimonials__quote body-lg">
              {t.quote}
            </p>
            <div className="testimonials__author">
              <div className="testimonials__avatar">
                {t.author.charAt(0)}
              </div>
              <div>
                <p className="testimonials__author-name">{t.author}</p>
                <p className="testimonials__author-company">{t.company}</p>
              </div>
              <span className="tag tag-gold testimonials__service">{t.service}</span>
            </div>
            {/* Stars */}
            <div className="testimonials__stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="testimonials__star">★</span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="testimonials__controls">
            <button className="testimonials__btn" onClick={prev} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>

            <div className="testimonials__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials__dot ${i === active ? 'testimonials__dot--active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button className="testimonials__btn" onClick={next} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
