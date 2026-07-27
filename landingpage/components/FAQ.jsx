'use client';

import { useRef, useState } from 'react';
import { faqs } from '../lib/data';

function FaqItem({ item, open, onToggle }) {
  const answerRef = useRef(null);
  return (
    <div className={`lp-faq__item ${open ? 'lp-faq__item--open' : ''}`}>
      <button className="lp-faq__q" onClick={onToggle} aria-expanded={open}>
        {item.q}
        <span className="lp-faq__icon">+</span>
      </button>
      <div
        className="lp-faq__a"
        style={{ maxHeight: open ? `${answerRef.current?.scrollHeight ?? 0}px` : 0 }}
      >
        <p ref={answerRef} className="lp-faq__a-inner">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="section section--white" id="faq">
      <div className="container">
        <div className="sec-header--center nh-reveal">
          <span className="sec-eyebrow sec-eyebrow--dark">FAQ</span>
          <h2 className="sec-heading--dark">
            Questions? <span className="sec-red">Answered</span>
          </h2>
          <div className="sec-rule" />
        </div>

        <div className="lp-faq nh-reveal">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
