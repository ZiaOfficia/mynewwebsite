/* ============================================================
   Hero visuals — one per page, same family as the home "Hi":
   a white disc with friendly UI cards on top. Every one shows
   something real about the page: a direct chat with an engineer,
   live client sites, the blog's own posts, the service at work.
   Decorative copies of UI, so they are hidden from screen readers.
   ============================================================ */
import Image from 'next/image';
import HiMark from './HiMark.jsx';

function Frame({ children, className = '', label }) {
  return (
    <div className={`hv ${className}`} role="img" aria-label={label}>
      <span className="hv__disc" aria-hidden="true" />
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

const Check = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12.5l4 4 8-9" /></svg>
);

/* ── A direct chat with an engineer (About, Contact) ───────── */
export function ChatVisual({ variant = 'about' }) {
  const lines = variant === 'contact'
    ? [
        { from: 'you', text: 'Hi! I need a new website for my clinic.' },
        { from: 'eng', text: 'Happy to help. Shall we do a quick call tomorrow? I can show you a few options.' },
        { from: 'you', text: 'Perfect, 11 am works.' },
      ]
    : [
        { from: 'you', text: 'Who will actually build my website?' },
        { from: 'eng', text: "I will. You'll have my number from the first call to launch day." },
        { from: 'you', text: "That's exactly what I wanted." },
      ];
  return (
    <Frame className="hv--chat" label="A client chatting directly with a HiBrands engineer">
      <div className="hv-card hv-chat">
        <div className="hv-chat__head">
          <HiMark className="hv-chat__avatar" title="" />
          <span>
            <span className="hv-chat__name">Your engineer</span>
            <span className="hv-chat__status"><span className="hv-dot" /> Online</span>
          </span>
        </div>
        <div className="hv-chat__body">
          {lines.map((l, i) => (
            <p key={i} className={`hv-msg hv-msg--${l.from}`} style={{ '--d': `${0.3 + i * 0.45}s` }}>{l.text}</p>
          ))}
          {variant === 'contact' && (
            <p className="hv-typing" style={{ '--d': '1.7s' }}><span /><span /><span /></p>
          )}
        </div>
      </div>
      <div className="hv-chip hv-chip--a">
        <span className="hv-chip__icon hv-chip__icon--mint"><Check /></span>
        {variant === 'contact' ? 'Reply within 24 hours' : 'No account managers'}
      </div>
      <div className="hv-chip hv-chip--b">
        <span className="hv-chip__icon">₹</span>
        Fixed price, agreed first
      </div>
    </Frame>
  );
}

/* ── Live client sites, fanned out (Projects) ──────────────── */
export function WorkVisual({ shots = [] }) {
  const three = shots.slice(0, 3);
  return (
    <Frame className="hv--work" label="Screenshots of live client websites">
      {three.map((s, i) => (
        <div key={s.slug} className={`hv-site hv-site--${i}`}>
          <div className="hv-site__bar"><span /><span /><span /><em>{s.host}</em></div>
          <Image src={`/projects/${s.slug}.jpg`} alt="" width={600} height={375} sizes="320px" priority={i === 1} />
        </div>
      ))}
      <div className="hv-chip hv-chip--live">
        <span className="hv-dot" /> All live, open any of them
      </div>
    </Frame>
  );
}

/* ── The blog's own latest posts as note cards (Blog) ──────── */
export function NotesVisual({ posts = [] }) {
  /* Latest real post on top; the cards behind name the topics we write about. */
  const topics = [
    { category: 'Google Ads', title: 'Spending ad money wisely' },
    { category: 'Websites',   title: 'Faster, clearer websites' },
    { category: 'Social Media', title: 'Posts that bring enquiries' },
  ];
  const latest = posts.slice(0, 3);
  const items = [...latest, ...topics.filter((t) => !latest.some((p) => p.category === t.category))].slice(0, 3);
  return (
    <Frame className="hv--notes" label="Cards showing the latest blog post and topics">
      {items.map((p, i) => (
        <div key={i} className={`hv-card hv-note hv-note--${i}`}>
          <span className="hv-note__cat">{p.category}</span>
          <span className="hv-note__title">{p.title}</span>
          <span className="hv-note__lines"><i /><i /><i /></span>
        </div>
      ))}
      <HiMark className="hv-notes__hi" title="" />
    </Frame>
  );
}

/* ── Service visuals ───────────────────────────────────────── */
function WebVisual() {
  return (
    <Frame className="hv--web" label="A new website on a laptop and a phone">
      <div className="hv-card hv-browser">
        <div className="hv-site__bar"><span /><span /><span /><em>yourbusiness.in</em></div>
        <div className="hv-browser__page">
          <div className="hv-wire hv-wire--nav"><i /><i /><i /><b /></div>
          <div className="hv-wire hv-wire--hero"><strong /><strong className="short" /><i /><b /></div>
          <div className="hv-wire hv-wire--cards"><i /><i /><i /></div>
        </div>
      </div>
      <div className="hv-card hv-phone">
        <div className="hv-phone__notch" />
        <div className="hv-wire hv-wire--hero"><strong /><strong className="short" /><b /></div>
        <div className="hv-wire hv-wire--stack"><i /><i /></div>
      </div>
      <div className="hv-chip hv-chip--a"><span className="hv-chip__icon hv-chip__icon--sun"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg></span>Fast on every phone</div>
    </Frame>
  );
}

function LandingVisual() {
  return (
    <Frame className="hv--landing" label="A landing page with one clear booking form">
      <div className="hv-card hv-phone hv-phone--big">
        <div className="hv-phone__notch" />
        <p className="hv-lp__title">Book your free check-up</p>
        <p className="hv-lp__sub">Takes 30 seconds. We'll call you back.</p>
        <span className="hv-lp__field">Your name</span>
        <span className="hv-lp__field">Phone number</span>
        <span className="hv-lp__btn">Book now</span>
      </div>
      <div className="hv-chip hv-chip--a"><span className="hv-chip__icon hv-chip__icon--mint"><Check /></span>New enquiry received</div>
      <div className="hv-chip hv-chip--b"><span className="hv-chip__icon hv-chip__icon--sun">1</span>One page, one goal</div>
    </Frame>
  );
}

function SeoVisual() {
  return (
    <Frame className="hv--seo" label="Search results with your business at the top">
      <div className="hv-card hv-search">
        <div className="hv-search__bar">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg>
          best dentist near me
        </div>
        <div className="hv-result hv-result--top">
          <span className="hv-result__rank">1</span>
          <span>
            <span className="hv-result__url">yourclinic.in</span>
            <span className="hv-result__title">Your Clinic · Gentle dental care</span>
            <span className="hv-result__stars">★★★★★</span>
          </span>
        </div>
        {[2, 3, 4].map((n) => (
          <div key={n} className="hv-result">
            <span className="hv-result__rank">{n}</span>
            <span className="hv-result__lines"><i /><i /></span>
          </div>
        ))}
      </div>
      <div className="hv-chip hv-chip--a"><span className="hv-chip__icon hv-chip__icon--sun">↑</span>Page one, and staying there</div>
    </Frame>
  );
}

function SocialVisual() {
  return (
    <Frame className="hv--social" label="A social media post getting likes and an enquiry">
      <div className="hv-card hv-phone hv-phone--big hv-post">
        <div className="hv-post__head"><span className="hv-post__avatar" /> <span className="hv-post__name">yourbrand</span></div>
        <div className="hv-post__img"><HiMark className="hv-post__hi" title="" /></div>
        <div className="hv-post__actions">
          <span className="hv-heart">♥</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l16-7-7 16-2-7z" /></svg>
        </div>
        <span className="hv-result__lines"><i /><i /></span>
      </div>
      <div className="hv-chip hv-chip--a"><span className="hv-chip__icon hv-chip__icon--pink">♥</span>Your post is getting likes</div>
      <div className="hv-chip hv-chip--b"><span className="hv-chip__icon hv-chip__icon--mint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" /></svg></span>"Is this available?"</div>
    </Frame>
  );
}

function AdsVisual() {
  return (
    <Frame className="hv--ads" label="A search ad and a chart of results">
      <div className="hv-card hv-ad">
        <span className="hv-ad__tag">Sponsored</span>
        <span className="hv-result__url">yourstore.in</span>
        <span className="hv-ad__title">Handmade gifts, delivered across India</span>
        <span className="hv-result__lines"><i /><i /></span>
      </div>
      <div className="hv-card hv-chart">
        <p className="hv-chart__label">Enquiries from ads</p>
        <div className="hv-chart__bars">
          {[30, 42, 38, 55, 64, 78, 92].map((h, i) => <i key={i} style={{ '--h': `${h}%`, '--d': `${0.2 + i * 0.08}s` }} />)}
        </div>
      </div>
      <div className="hv-chip hv-chip--a"><span className="hv-chip__icon hv-chip__icon--mint">₹</span>Every rupee tracked</div>
    </Frame>
  );
}

export function ServiceVisual({ slug }) {
  switch (slug) {
    case 'web-development': return <WebVisual />;
    case 'landing-pages':   return <LandingVisual />;
    case 'seo':             return <SeoVisual />;
    case 'smo':             return <SocialVisual />;
    case 'google-ads':      return <AdsVisual />;
    default:                return null;
  }
}
