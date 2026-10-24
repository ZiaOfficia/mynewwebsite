import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Body, BrowserFrame, Chip, Display, HiMark, PhoneFrame, useEnter, useExit, usePop } from "../components";
import { BODY, C, DISPLAY, EASE, clamp, useLayout } from "../theme";

type SceneProps = { duration: number };

/* ── Real client work ─────────────────────────────────────────────── */
const SITES = [
  { src: "projects/elegantize.jpg", url: "elegantize.com" },
  { src: "projects/paramount-psychiatry.jpg", url: "paramountpsychiatrynj.com" },
  { src: "projects/dumuzi.jpg", url: "dumuzi.in" },
];

export const Work: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v, width, height } = useLayout();
  const fw = (v ? 760 : 820) * u;
  const fh = fw * 0.66;
  const drift = interpolate(frame, [60, duration], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.paper, ...useExit(duration) }}>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 170 : 120) * u, right: (v ? 80 : 150) * u }}>
        <Display size={(v ? 112 : 112) * u} style={useEnter(2, 30)}>
          Real websites. All live.
        </Display>
        <Body size={(v ? 42 : 38) * u} style={{ marginTop: 22 * u, ...useEnter(8, 24) }}>
          Weddings, healthcare, e-commerce, non-profits and more.
        </Body>
      </div>
      {SITES.map((s, i) => {
        const at = 24 + i * 18;
        const p = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 110 } });
        const landscapeX = [width * 0.5 - fw * 1.05, width * 0.5 - fw * 0.5, width * 0.5 + fw * 0.05];
        const landscapeY = [height * 0.43, height * 0.36, height * 0.47];
        const verticalX = [width * 0.5 - fw * 0.55, width * 0.5 - fw * 0.45, width * 0.5 - fw * 0.5];
        const verticalY = [height * 0.3, height * 0.47, height * 0.64];
        const x = v ? verticalX[i] : landscapeX[i];
        const y = v ? verticalY[i] : landscapeY[i];
        const rot = [-6, 0, 5][i];
        return (
          <div
            key={s.url}
            style={{
              position: "absolute",
              left: x + (i - 1) * drift * 30 * u,
              top: y + interpolate(p, [0, 1], [height * 0.6, 0]),
              rotate: `${rot}deg`,
              zIndex: i === 1 ? 2 : i === 2 ? 3 : 1,
              opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
            }}
          >
            <BrowserFrame u={u} width={fw} height={fh} src={s.src} url={s.url} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: (v ? 150 : 70) * u, display: "flex", justifyContent: "center", zIndex: 5, ...usePop(96) }}>
        <Chip u={u} tone="mint" icon="✓">
          8 client sites live at hibrands.in/projects
        </Chip>
      </div>
    </AbsoluteFill>
  );
};

/* ── A tour of hibrands.in, desktop and phone ─────────────────────── */
export const Tour: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const bw = (v ? 900 : 1180) * u;
  const bh = bw * 0.64;
  const pw = (v ? 360 : 300) * u;
  const scroll = interpolate(frame, [20, duration - 10], [0, 1], { ...clamp, easing: EASE });
  const rise = (at: number) => interpolate(frame, [at, at + 24], [500 * u, 0], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill style={{ background: C.paperDeep, ...useExit(duration) }}>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 170 : 110) * u, right: (v ? 80 : 150) * u }}>
        <Display size={(v ? 112 : 110) * u} color={C.cobalt} style={useEnter(2, 30)}>
          hibrands.in
        </Display>
        <Body size={(v ? 44 : 40) * u} style={{ marginTop: 18 * u, ...useEnter(8, 24) }}>
          Every page made for every screen, from phones to big desktops.
        </Body>
      </div>
      <div style={{ position: "absolute", left: (v ? 90 : 600) * u, top: (v ? 560 : 370) * u, translate: `0px ${rise(6)}px` }}>
        <BrowserFrame u={u} width={bw} height={bh} src="site/home-full.jpg" url="hibrands.in" scrollY={scroll * 3600 * (bw / 1920)} />
      </div>
      <div style={{ position: "absolute", left: (v ? 620 : 300) * u, top: (v ? 1060 : 420) * u, translate: `0px ${rise(16)}px` }}>
        <PhoneFrame u={u} width={pw} src="site/home-phone-full.jpg" scrollY={scroll * 2600 * (pw / 1080)} />
      </div>
    </AbsoluteFill>
  );
};

/* ── Why we're different ──────────────────────────────────────────── */
const PROMISES = [
  { title: "No big offices to pay for", text: "We stay small on purpose, so your money goes into your project." },
  { title: "No wall between you and us", text: "Call or message the engineer doing your work." },
  { title: "Fair prices, told up front", text: "A fixed price before anything starts. No hidden fees." },
];

const ICONS = [
  <svg key="a" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 27V8l9-3v22M16 12h9v15M11 12h1M11 17h1M11 22h1M20 17h1M20 22h1M4 27h24" />
    <path d="M5 5l22 22" stroke={C.cobalt} strokeWidth="2.8" />
  </svg>,
  <svg key="b" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="7" cy="16" r="4" />
    <circle cx="25" cy="16" r="4" />
    <path d="M11 16h10" stroke={C.cobalt} strokeWidth="2.8" />
  </svg>,
  <svg key="c" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 4H27v10L15 26a2.8 2.8 0 0 1-4 0l-6-6a2.8 2.8 0 0 1 0-4z" />
    <path d="M13 13h6M13 16h6M17 13c2 0 2 3 0 3h-3l4 4" stroke={C.cobalt} strokeWidth="2.4" />
  </svg>,
];

export const Promises: React.FC<SceneProps> = ({ duration }) => {
  const { u, v } = useLayout();
  return (
    <AbsoluteFill
      style={{
        background: C.cobalt,
        justifyContent: v ? "center" : "flex-start",
        padding: v ? `${120 * u}px ${80 * u}px` : `${130 * u}px ${150 * u}px`,
        ...useExit(duration),
      }}
    >
      <Display size={(v ? 112 : 120) * u} color="#fff" style={{ maxWidth: v ? undefined : 1300 * u, ...useEnter(2, 30) }}>
        We're not an agency built for profit.
      </Display>
      <div
        style={{
          display: "flex",
          flexDirection: v ? "column" : "row",
          gap: (v ? 64 : 60) * u,
          marginTop: (v ? 90 : 100) * u,
          paddingTop: (v ? 70 : 70) * u,
          borderTop: `${2 * u}px solid rgba(255,255,255,0.3)`,
        }}
      >
        {PROMISES.map((p, i) => (
          <div key={p.title} style={{ flex: 1, display: v ? "flex" : "block", gap: 30 * u, alignItems: "flex-start" }}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                width: 104 * u,
                height: 104 * u,
                borderRadius: "50%",
                background: C.marigold,
                color: C.ink,
                ...usePop(18 + i * 18),
              }}
            >
              <div style={{ width: 56 * u, height: 56 * u }}>{ICONS[i]}</div>
            </div>
            <div style={useEnter(22 + i * 18, 24)}>
              <Display size={(v ? 54 : 52) * u} color="#fff" style={{ marginTop: v ? 6 * u : 34 * u, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {p.title}
              </Display>
              <Body size={(v ? 34 : 32) * u} color="rgba(255,255,255,0.88)" style={{ marginTop: 14 * u }}>
                {p.text}
              </Body>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ── Call to action, then the logo ────────────────────────────────── */
export const Cta: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v, width, height } = useLayout();
  const WIPE = 120;
  const LOGO = 132;
  const wipe = interpolate(frame, [WIPE, WIPE + 16], [0, 1], { ...clamp, easing: EASE });
  const press = interpolate(frame, [86, 90, 96], [1, 0.93, 1], clamp);
  const logo = spring({ frame: frame - LOGO, fps, config: { damping: 9, stiffness: 140, mass: 0.7 } });
  const radius = Math.hypot(width, height) * wipe;
  const btnX = v ? width / 2 : 150 * u + 260 * u;
  const btnY = v ? height * 0.62 : height * 0.68;

  return (
    <AbsoluteFill style={{ background: C.marigold }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: v ? "center" : "flex-start",
          padding: v ? `${120 * u}px ${80 * u}px` : `${170 * u}px ${150 * u}px`,
          opacity: interpolate(frame, [WIPE, WIPE + 10], [1, 0], clamp),
        }}
      >
        <Display size={(v ? 128 : 140) * u} style={{ maxWidth: 1350 * u, ...useEnter(2, 40) }}>
          Talk to the engineer who'll do the work.
        </Display>
        <Body size={(v ? 44 : 42) * u} color={C.ink} style={{ marginTop: 34 * u, maxWidth: 1100 * u, ...useEnter(14, 24) }}>
          A free call, no obligation. An honest answer on time and price.
        </Body>
        <div
          style={{
            display: "flex",
            flexDirection: v ? "column" : "row",
            alignItems: v ? "stretch" : "center",
            gap: (v ? 30 : 44) * u,
            marginTop: (v ? 80 : 64) * u,
          }}
        >
          <div
            style={{
              padding: `${30 * u}px ${56 * u}px`,
              borderRadius: 999,
              background: frame >= 90 ? C.cobaltDeep : C.ink,
              color: "#fff",
              fontFamily: BODY,
              fontWeight: 750,
              fontSize: 40 * u,
              textAlign: "center",
              scale: String(press),
              ...usePop(36),
            }}
          >
            Book a free call
          </div>
          <div style={useEnter(50, 20)}>
            <Body size={(v ? 46 : 40) * u} color={C.ink} style={{ fontWeight: 750, textAlign: v ? "center" : "left" }}>
              hibrands.in
            </Body>
            <Body size={(v ? 40 : 34) * u} color={C.ink} style={{ textAlign: v ? "center" : "left" }}>
              +91 90649 90515
            </Body>
          </div>
        </div>
      </div>

      {/* Paper wipe from the button, then the logo */}
      <div
        style={{
          position: "absolute",
          left: btnX - radius,
          top: btnY - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          background: C.paper,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: frame >= LOGO ? 1 : 0,
          scale: String(interpolate(frame, [LOGO, duration], [1, 1.04], clamp)),
        }}
      >
        <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: (v ? 36 : 48) * u }}>
          <HiMark
            size={(v ? 260 : 230) * u}
            style={{
              scale: String(interpolate(logo, [0, 1], [0.2, 1])),
              rotate: `${interpolate(logo, [0, 1], [-18, 0])}deg`,
              filter: `drop-shadow(0 ${24 * u}px ${30 * u}px rgba(214,150,0,0.3))`,
            }}
          />
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: (v ? 150 : 180) * u,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              color: C.ink,
              ...useEnter(LOGO + 6, 30),
            }}
          >
            <span style={{ color: C.cobalt }}>Hi</span>Brands
          </div>
        </div>
        <Body size={(v ? 42 : 40) * u} color={C.ink2} style={{ marginTop: 44 * u, textAlign: "center", ...useEnter(LOGO + 18, 20) }}>
          Websites, SEO, social media and Google Ads.
          <br />
          Direct from the engineers.
        </Body>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
