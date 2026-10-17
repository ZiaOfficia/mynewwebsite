import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Body, BrowserFrame, Card, Chip, Display, HiMark, PhoneFrame, useEnter, useExit, usePop } from "../components";
import { BODY, C, DISPLAY, EASE, clamp, useLayout } from "../theme";

type ServiceProps = {
  duration: number;
  index: number;
  name: string;
  line: string;
  price: string;
  visual: React.FC<{ w: number; h: number; u: number }>;
};

/* Shared layout: words on one side, the service at work on the other */
export const ServiceScene: React.FC<ServiceProps> = ({ duration, index, name, line, price, visual: Visual }) => {
  const { u, v } = useLayout();
  const frame = useCurrentFrame();
  const vw = (v ? 920 : 820) * u;
  const vh = (v ? 920 : 720) * u;
  return (
    <AbsoluteFill
      style={{
        background: index % 2 ? C.paperDeep : C.paper,
        flexDirection: v ? "column" : "row",
        alignItems: v ? "flex-start" : "center",
        justifyContent: v ? "center" : "space-between",
        padding: v ? `${120 * u}px ${80 * u}px` : `0 ${150 * u}px`,
        gap: (v ? 70 : 60) * u,
        ...useExit(duration),
      }}
    >
      <div style={{ width: v ? "100%" : 760 * u }}>
        <Body size={30 * u} color={C.cobalt} style={{ fontWeight: 700, ...useEnter(2, 20) }}>
          Service {index} of 5
        </Body>
        <Display size={(v ? 132 : 140) * u} style={{ marginTop: 16 * u, ...useEnter(4, 40) }}>
          {name}
        </Display>
        <Body size={(v ? 44 : 42) * u} style={{ marginTop: 26 * u, maxWidth: 700 * u, ...useEnter(10, 30) }}>
          {line}
        </Body>
        <div
          style={{
            display: "inline-block",
            marginTop: 36 * u,
            padding: `${14 * u}px ${28 * u}px`,
            borderRadius: 999,
            background: C.surface,
            border: `${2 * u}px solid ${C.line}`,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 32 * u,
            color: C.ink,
            ...useEnter(16, 24),
          }}
        >
          {price}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: vw,
          height: vh,
          flexShrink: 0,
          alignSelf: "center",
          opacity: interpolate(frame, [6, 16], [0, 1], clamp),
          scale: String(interpolate(frame, [6, 26], [0.94, 1], { ...clamp, easing: EASE })),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: `${4 * u}% ${2 * u}% 0 ${6 * u}%`,
            left: vw * 0.06,
            top: vh * 0.04,
            right: vw * 0.02,
            bottom: 0,
            borderRadius: "50%",
            background: C.surface,
            boxShadow: `0 ${40 * u}px ${80 * u}px -${40 * u}px rgba(48,80,240,0.35)`,
          }}
        />
        <Visual w={vw} h={vh} u={u} />
      </div>
    </AbsoluteFill>
  );
};

const Abs: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", ...style }}>{children}</div>
);

/* ── Websites: laptop and phone ───────────────────────────────────── */
export const WebVisual: React.FC<{ w: number; h: number; u: number }> = ({ w, h, u }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Abs style={{ left: 0, top: h * 0.12, ...useEnter(8, 40, 22) }}>
        <BrowserFrame
          u={u}
          width={w * 0.84}
          height={w * 0.84 * 0.66}
          src="projects/elegantize.jpg"
          url="elegantize.com"
        />
      </Abs>
      <Abs
        style={{
          right: w * 0.02,
          bottom: h * 0.02,
          translate: `0px ${interpolate(frame, [36, 58], [h * 0.5, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        <PhoneFrame
          u={u}
          width={w * 0.3}
          src="site/home-phone-full.jpg"
          scrollY={interpolate(frame, [60, 140], [0, 900 * u], { ...clamp, easing: EASE })}
        />
      </Abs>
      <Abs style={{ left: 0, bottom: h * 0.06, ...usePop(64) }}>
        <Chip u={u} tone="sun" icon="⚡">
          Fast on every phone
        </Chip>
      </Abs>
    </>
  );
};

/* ── Landing pages: a form that gets filled and sent ──────────────── */
const typed = (text: string, frame: number, start: number, end: number) =>
  text.slice(0, Math.round(interpolate(frame, [start, end], [0, text.length], clamp)));

export const LandingVisual: React.FC<{ w: number; h: number; u: number }> = ({ w, h, u }) => {
  const frame = useCurrentFrame();
  const pw = w * 0.44;
  const press = interpolate(frame, [84, 88, 94], [1, 0.92, 1], clamp);
  const field = (label: string, value: string) => (
    <div
      style={{
        marginTop: 16 * u,
        padding: `${16 * u}px ${18 * u}px`,
        borderRadius: 14 * u,
        border: `${2.5 * u}px solid ${value ? C.cobalt : C.line}`,
        fontFamily: BODY,
        fontSize: 26 * u,
        color: value ? C.ink : C.ink3,
      }}
    >
      {value || label}
    </div>
  );
  return (
    <>
      <Abs style={{ left: w * 0.04, top: h * 0.02, ...useEnter(6, 50, 22) }}>
        <PhoneFrame u={u} width={pw}>
          <div style={{ padding: `${70 * u}px ${26 * u}px` }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40 * u, lineHeight: 1.05, color: C.ink, letterSpacing: "-0.02em" }}>
              Book your free check-up
            </div>
            <Body size={22 * u} style={{ marginTop: 12 * u }} color={C.ink3}>
              Takes 30 seconds. We'll call you back.
            </Body>
            {field("Your name", typed("Priya Sharma", frame, 36, 60))}
            {field("Phone number", typed("98765 43210", frame, 46, 68))}
            <div
              style={{
                marginTop: 22 * u,
                padding: `${18 * u}px`,
                borderRadius: 99,
                background: frame >= 88 ? C.cobaltDeep : C.cobalt,
                color: "#fff",
                textAlign: "center",
                fontFamily: BODY,
                fontWeight: 750,
                fontSize: 28 * u,
                scale: String(press),
              }}
            >
              {frame >= 92 ? "Booked ✓" : "Book now"}
            </div>
          </div>
        </PhoneFrame>
      </Abs>
      <Abs style={{ right: 0, top: h * 0.16, ...usePop(96) }}>
        <Card u={u} style={{ padding: `${20 * u}px ${26 * u}px`, display: "flex", gap: 16 * u, alignItems: "center" }}>
          <span style={{ display: "grid", placeItems: "center", width: 54 * u, height: 54 * u, borderRadius: "50%", background: C.mint, color: C.mintInk, fontWeight: 800, fontSize: 28 * u, fontFamily: BODY }}>
            ✓
          </span>
          <span>
            <Body size={26 * u} color={C.ink} style={{ fontWeight: 750 }}>
              New enquiry received
            </Body>
            <Body size={22 * u} color={C.ink3}>
              Priya Sharma, just now
            </Body>
          </span>
        </Card>
      </Abs>
      <Abs style={{ right: 0, bottom: h * 0.18, ...usePop(30) }}>
        <Chip u={u} tone="sun" icon="1">
          One page, one goal
        </Chip>
      </Abs>
    </>
  );
};

/* ── SEO: your result climbs to number one ─────────────────────────── */
export const SeoVisual: React.FC<{ w: number; h: number; u: number }> = ({ w, h, u }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const climb = spring({ frame: frame - 44, fps, config: { damping: 15, stiffness: 90 } });
  const rowH = 96 * u;
  const yours = interpolate(climb, [0, 1], [3, 0]);
  const order = [0, 1, 2]; // other results
  return (
    <>
      <Abs style={{ left: w * 0.04, top: h * 0.12, ...useEnter(6, 40, 22) }}>
        <Card u={u} style={{ width: w * 0.9, padding: 26 * u }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14 * u,
              padding: `${16 * u}px ${22 * u}px`,
              borderRadius: 99,
              background: C.paper,
              fontFamily: BODY,
              fontSize: 28 * u,
              color: C.ink2,
            }}
          >
            <svg width={26 * u} height={26 * u} viewBox="0 0 24 24" fill="none" stroke={C.ink2} strokeWidth="2.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M20 20l-4-4" />
            </svg>
            {typed("best dentist near me", frame, 10, 34)}
          </div>
          <div style={{ position: "relative", height: rowH * 4 + 10 * u, marginTop: 14 * u }}>
            {order.map((n) => {
              const y = interpolate(climb, [0, 1], [n * rowH, (n + 1) * rowH]);
              return (
                <div key={n} style={{ position: "absolute", left: 0, right: 0, top: y, height: rowH - 10 * u, display: "flex", alignItems: "center", gap: 18 * u, padding: `0 ${14 * u}px` }}>
                  <span style={{ display: "grid", placeItems: "center", width: 46 * u, height: 46 * u, borderRadius: "50%", background: C.paper, fontFamily: BODY, fontWeight: 800, fontSize: 22 * u, color: C.ink3 }}>
                    {frame >= 50 ? n + 2 : n + 1}
                  </span>
                  <span style={{ flex: 1, display: "grid", gap: 10 * u }}>
                    <i style={{ height: 12 * u, borderRadius: 6 * u, background: C.paperDeep, width: "85%" }} />
                    <i style={{ height: 12 * u, borderRadius: 6 * u, background: C.paperDeep, width: "55%" }} />
                  </span>
                </div>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: yours * rowH,
                height: rowH - 10 * u,
                display: "flex",
                alignItems: "center",
                gap: 18 * u,
                padding: `0 ${14 * u}px`,
                borderRadius: 18 * u,
                background: C.marigoldSoft,
                boxShadow: `inset 0 0 0 ${3 * u}px ${C.marigold}`,
              }}
            >
              <span style={{ display: "grid", placeItems: "center", width: 46 * u, height: 46 * u, borderRadius: "50%", background: C.marigold, fontFamily: BODY, fontWeight: 800, fontSize: 22 * u, color: C.ink }}>
                {frame >= 50 ? 1 : 4}
              </span>
              <span>
                <Body size={20 * u} color={C.mintInk}>yourclinic.in</Body>
                <Body size={28 * u} color={C.cobaltDeep} style={{ fontWeight: 750 }}>
                  Your Clinic · Gentle dental care
                </Body>
              </span>
            </div>
          </div>
        </Card>
      </Abs>
      <Abs style={{ right: 0, bottom: h * 0.05, ...usePop(70) }}>
        <Chip u={u} tone="sun" icon="↑">
          Page one, and staying there
        </Chip>
      </Abs>
    </>
  );
};

/* ── Social media: a post people love, and an enquiry ─────────────── */
export const SocialVisual: React.FC<{ w: number; h: number; u: number }> = ({ w, h, u }) => {
  const frame = useCurrentFrame();
  const likes = Math.round(interpolate(frame, [44, 110], [212, 1284], { ...clamp, easing: EASE }));
  const pw = w * 0.44;
  const heart = (at: number, x: number) => {
    const t = interpolate(frame, [at, at + 40], [0, 1], clamp);
    return (
      <span
        key={at}
        style={{
          position: "absolute",
          left: x,
          bottom: h * 0.28,
          fontSize: 52 * u,
          color: "#E0245E",
          opacity: interpolate(t, [0, 0.15, 0.8, 1], [0, 1, 1, 0]),
          translate: `0px ${-t * 260 * u}px`,
          scale: String(interpolate(t, [0, 0.2, 1], [0.4, 1.2, 0.9])),
        }}
      >
        ♥
      </span>
    );
  };
  return (
    <>
      <Abs style={{ left: w * 0.24, top: h * 0.02, ...useEnter(6, 50, 22) }}>
        <PhoneFrame u={u} width={pw}>
          <div style={{ padding: `${64 * u}px ${20 * u}px ${20 * u}px` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 * u }}>
              <span style={{ width: 40 * u, height: 40 * u, borderRadius: "50%", background: `linear-gradient(135deg, ${C.marigold}, #FF9C8A)` }} />
              <Body size={24 * u} color={C.ink} style={{ fontWeight: 750 }}>
                yourbrand
              </Body>
            </div>
            <div style={{ marginTop: 16 * u, aspectRatio: "1", borderRadius: 18 * u, background: `linear-gradient(140deg, ${C.cobaltSoft}, ${C.mint})`, display: "grid", placeItems: "center" }}>
              <HiMark size={pw * 0.42} style={{ rotate: `${interpolate(frame, [0, 140], [-6, 6])}deg` }} />
            </div>
            <div style={{ display: "flex", gap: 22 * u, marginTop: 16 * u, fontSize: 36 * u, color: C.ink2, alignItems: "center" }}>
              <span style={{ color: frame >= 44 ? "#E0245E" : C.ink2, scale: String(interpolate(frame, [44, 48, 54], [1, 1.5, 1], clamp)) }}>♥</span>
              <svg width={32 * u} height={32 * u} viewBox="0 0 24 24" fill="none" stroke={C.ink2} strokeWidth="2.2" strokeLinejoin="round">
                <path d="M4 5h16v11H9l-5 4z" />
              </svg>
            </div>
            <Body size={24 * u} color={C.ink} style={{ fontWeight: 700, marginTop: 8 * u }}>
              {likes.toLocaleString("en-IN")} likes
            </Body>
          </div>
        </PhoneFrame>
      </Abs>
      {heart(44, w * 0.3)}
      {heart(56, w * 0.38)}
      {heart(68, w * 0.33)}
      <Abs style={{ right: 0, top: h * 0.56, ...usePop(94) }}>
        <Chip u={u} tone="mint" icon="✉">
          "Is this available?"
        </Chip>
      </Abs>
      <Abs style={{ left: 0, top: h * 0.2, ...usePop(30) }}>
        <Chip u={u} tone="pink" icon="♥">
          Posts that bring enquiries
        </Chip>
      </Abs>
    </>
  );
};

/* ── Google Ads: an ad and the results it brings ───────────────────── */
export const AdsVisual: React.FC<{ w: number; h: number; u: number }> = ({ w, h, u }) => {
  const frame = useCurrentFrame();
  const bars = [30, 42, 38, 55, 64, 78, 94];
  return (
    <>
      <Abs style={{ left: w * 0.02, top: h * 0.1, ...useEnter(6, 40, 22) }}>
        <Card u={u} style={{ width: w * 0.8, padding: `${26 * u}px ${30 * u}px` }}>
          <Body size={22 * u} color={C.ink} style={{ fontWeight: 800 }}>
            Sponsored
          </Body>
          <Body size={22 * u} color={C.mintInk}>yourstore.in</Body>
          <Body size={32 * u} color={C.cobaltDeep} style={{ fontWeight: 750, marginTop: 6 * u }}>
            Handmade gifts, delivered across India
          </Body>
          <div style={{ display: "grid", gap: 10 * u, marginTop: 14 * u }}>
            <i style={{ height: 12 * u, borderRadius: 6 * u, background: C.paperDeep, width: "90%" }} />
            <i style={{ height: 12 * u, borderRadius: 6 * u, background: C.paperDeep, width: "60%" }} />
          </div>
        </Card>
      </Abs>
      <Abs style={{ right: 0, bottom: h * 0.04, ...useEnter(20, 40, 22) }}>
        <Card u={u} style={{ width: w * 0.54, padding: `${26 * u}px ${30 * u}px` }}>
          <Body size={24 * u} color={C.ink2} style={{ fontWeight: 700 }}>
            Enquiries from ads
          </Body>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 * u, height: 200 * u, marginTop: 18 * u }}>
            {bars.map((b, i) => (
              <i
                key={i}
                style={{
                  flex: 1,
                  height: `${b * interpolate(frame, [32 + i * 6, 42 + i * 6], [0, 1], { ...clamp, easing: EASE })}%`,
                  borderRadius: `${10 * u}px ${10 * u}px ${4 * u}px ${4 * u}px`,
                  background: i === bars.length - 1 ? C.marigold : C.cobalt,
                }}
              />
            ))}
          </div>
        </Card>
      </Abs>
      <Abs style={{ left: 0, bottom: h * 0.08, ...usePop(90) }}>
        <Chip u={u} tone="mint" icon="₹">
          Every rupee tracked
        </Chip>
      </Abs>
    </>
  );
};
