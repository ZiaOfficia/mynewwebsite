import { RiStarFill, RiDoubleQuotesR } from 'react-icons/ri';
import { testimonials } from '../lib/data';

/* Every quote is shown at once in a grid — each card picks up its own accent
   pair so the section reads as a wall of colour rather than one rotating slide.
   Name + message only; no company names. */
const ACCENTS = [
  ['#CC1F35', '#FF6B6B'],
  ['#C9A84C', '#F2D06B'],
  ['#4169E1', '#8B5CF6'],
  ['#14B8A6', '#34D399'],
  ['#D946EF', '#F472B6'],
  ['#F97316', '#FBBF24'],
];

export default function Testimonials() {
  return (
    <section className="section section--navy" id="testimonials">
      <div className="container">
        <div className="sec-header--center nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--light">Client Love</span>
          <h2 className="sec-heading--light">
            Don&apos;t Just Take <span className="sec-red">Our Word</span>
          </h2>
          <div className="sec-rule" />
        </div>

        <div className="lp-testi-grid">
          {testimonials.map((t, i) => {
            const [c1, c2] = ACCENTS[i % ACCENTS.length];
            return (
              <article
                key={t.author}
                className={`lp-testi-card nh-reveal nh-delay-${(i % 4) + 1}`}
                style={{ '--tc1': c1, '--tc2': c2 }}
              >
                <RiDoubleQuotesR className="lp-testi-card__mark" aria-hidden="true" />
                <div className="lp-testi-card__stars" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }, (_, s) => (
                    <RiStarFill key={s} size={16} />
                  ))}
                </div>
                <p className="lp-testi-card__quote">{t.quote}</p>
                <div className="lp-testi-card__author">
                  <span className="lp-testi-card__avatar" aria-hidden="true">
                    {t.author.charAt(0)}
                  </span>
                  <div>
                    <p className="lp-testi-card__name">{t.author}</p>
                    <span className="lp-testi-card__tag">{t.service}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
