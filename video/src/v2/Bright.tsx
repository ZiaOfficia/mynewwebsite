import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Body, Card, Chip, Display, HiMark, PhoneFrame, useEnter, useExit, usePop } from "../components";
import { BODY, C, DISPLAY, EASE, clamp, useLayout } from "../theme";
import { Eyebrow, G, GlowBg, Particles, glowText } from "./kit";

type SceneProps = { duration: number };

/* ── 5. Hi. We're engineers, not an agency ─────────────────────────── */
export const Reveal: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v } = useLayout();
  const s = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 120, mass: 0.8 } });
  return (
    <GlowBg strength={1.3} style={useExit(duration)}>
      <Particles n={46} seed="reveal" size={6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: `0 ${(v ? 80 : 150) * u}px`, textAlign: "center" }}>
        <div style={{ position: "relative", display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: (v ? 30 : 44) * u }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 900 * u,
              height: 900 * u,
              translate: "-50% -50%",
              background: `radial-gradient(circle, rgba(255,200,61,0.45) 0%, rgba(30,200,240,0.18) 35%, transparent 65%)`,
              opacity: s,
            }}
          />
          <HiMark
            size={(v ? 250 : 210) * u}
            style={{ position: "relative", scale: String(interpolate(s, [0, 1], [0.2, 1])), rotate: `${interpolate(s, [0, 1], [-20, 0])}deg`, filter: `drop-shadow(0 ${20 * u}px ${36 * u}px rgba(214,150,0,0.35))` }}
          />
          <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: (v ? 150 : 170) * u, letterSpacing: "-0.055em", lineHeight: 1, color: C.ink, ...useEnter(14, 30) }}>
            <span style={{ color: C.cobalt }}>Hi</span>Brands
          </div>
        </div>
        <Display size={(v ? 108 : 104) * u} style={{ marginTop: (v ? 80 : 70) * u, ...useEnter(44, 36) }}>
          We're engineers. <span style={glowText()}>Not an agency.</span>
        </Display>
        <Body size={(v ? 44 : 42) * u} color={C.ink2} style={{ marginTop: 30 * u, maxWidth: 1250 * u, textWrap: "balance", ...useEnter(78, 24) }}>
          That's why every section gets high-quality work, at the minimum price.
        </Body>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 16], [1, 0], clamp) }} />
    </GlowBg>
  );
};

/* ── 6. Direct access to the engineers: a real conversation ────────── */
const Grow: React.FC<{ at: number; children: React.ReactNode; max?: number }> = ({ at, children, max = 400 }) => {
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const t = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ maxHeight: t * max * u, overflow: "hidden", opacity: t, translate: `0px ${(1 - t) * 20 * u}px`, flexShrink: 0 }}>
      {children}
    </div>
  );
};

const Bubble: React.FC<{ me?: boolean; children: React.ReactNode; u: number }> = ({ me, children, u }) => (
  <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", paddingTop: 14 * u }}>
    <div
      style={{
        maxWidth: "82%",
        padding: `${14 * u}px ${20 * u}px`,
        borderRadius: 26 * u,
        borderBottomRightRadius: me ? 8 * u : 26 * u,
        borderBottomLeftRadius: me ? 26 * u : 8 * u,
        background: me ? C.cobalt : "#fff",
        color: me ? "#fff" : C.ink,
        fontFamily: BODY,
        fontSize: 23 * u,
        lineHeight: 1.35,
        fontWeight: 520,
        boxShadow: me ? "none" : `0 ${8 * u}px ${20 * u}px -${10 * u}px rgba(24,33,61,0.3)`,
      }}
    >
      {children}
    </div>
  </div>
);

export const CHAT = { you1: 14, typing: 32, eng1: 54, preview: 80, you2: 118, eng2: 144, chip1: 160, chip2: 176 };

export const Direct: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const pw = (v ? 470 : 430) * u;
  const typing = frame >= CHAT.typing && frame < CHAT.eng1;
  return (
    <GlowBg style={useExit(duration)}>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 170 : 250) * u, width: (v ? 920 : 860) * u }}>
        <Eyebrow u={u} color={C.cobalt} style={useEnter(2, 20)}>
          How it works with us
        </Eyebrow>
        <Display size={(v ? 118 : 128) * u} style={{ marginTop: 20 * u, ...useEnter(6, 40) }}>
          Direct access <span style={glowText()}>to the engineers.</span>
        </Display>
        <div style={{ display: "flex", flexDirection: v ? "row" : "column", flexWrap: "wrap", alignItems: "flex-start", gap: 20 * u, marginTop: (v ? 40 : 56) * u }}>
          <div style={usePop(CHAT.chip1)}>
            <Chip u={u} tone="mint" icon="✓">
              No account managers in between
            </Chip>
          </div>
          <div style={usePop(CHAT.chip2)}>
            <Chip u={u} tone="sun" icon="✓">
              Less unnecessary overhead
            </Chip>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: v ? (1080 * u - pw) / 2 : 1240 * u, top: (v ? 790 : 100) * u, ...useEnter(4, 80, 26) }}>
        <PhoneFrame u={u} width={pw}>
          <div style={{ position: "absolute", inset: 0, background: "#F3F6FD", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: `${62 * u}px ${22 * u}px ${18 * u}px`, display: "flex", alignItems: "center", gap: 14 * u, background: "#fff", borderBottom: `${1.5 * u}px solid ${C.line}` }}>
              <span style={{ display: "grid", placeItems: "center", width: 54 * u, height: 54 * u, borderRadius: "50%", background: C.paper }}>
                <HiMark size={36 * u} />
              </span>
              <span>
                <Body size={25 * u} color={C.ink} style={{ fontWeight: 750, lineHeight: 1.2 }}>
                  Your engineer
                </Body>
                <Body size={19 * u} color={C.mintInk} style={{ lineHeight: 1.2, display: "flex", alignItems: "center", gap: 8 * u }}>
                  <span style={{ width: 10 * u, height: 10 * u, borderRadius: "50%", background: "#2BB673" }} /> online
                </Body>
              </span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: `0 ${18 * u}px ${24 * u}px`, overflow: "hidden" }}>
              <Grow at={CHAT.you1}>
                <Bubble me u={u}>Can we add online booking to our site?</Bubble>
              </Grow>
              {typing || frame < CHAT.typing ? (
                <Grow at={CHAT.typing} max={90}>
                  <Bubble u={u}>
                    <span style={{ display: "inline-flex", gap: 8 * u, padding: `${6 * u}px 0` }}>
                      {[0, 1, 2].map((d) => (
                        <span key={d} style={{ width: 11 * u, height: 11 * u, borderRadius: "50%", background: C.ink3, opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame - d * 4) / 5)) }} />
                      ))}
                    </span>
                  </Bubble>
                </Grow>
              ) : null}
              <Grow at={CHAT.eng1}>
                <Bubble u={u}>Yes. I'll build it today and send you a preview.</Bubble>
              </Grow>
              <Grow at={CHAT.preview}>
                <div style={{ paddingTop: 14 * u, width: "84%" }}>
                  <div style={{ borderRadius: 20 * u, overflow: "hidden", background: "#fff", boxShadow: `0 ${10 * u}px ${24 * u}px -${12 * u}px rgba(24,33,61,0.35)` }}>
                    <div style={{ height: 150 * u, background: `linear-gradient(135deg, ${C.cobaltSoft}, ${C.mintSoft})`, padding: 18 * u }}>
                      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26 * u, color: C.ink }}>Book an appointment</div>
                      <div style={{ display: "flex", gap: 8 * u, marginTop: 14 * u }}>
                        {["Mon", "Tue", "Wed", "Thu"].map((d, i) => (
                          <span key={d} style={{ flex: 1, padding: `${10 * u}px 0`, textAlign: "center", borderRadius: 10 * u, background: i === 1 ? C.cobalt : "#fff", color: i === 1 ? "#fff" : C.ink2, fontFamily: BODY, fontWeight: 650, fontSize: 17 * u }}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Body size={18 * u} color={C.ink3} style={{ padding: `${10 * u}px ${16 * u}px` }}>
                      Preview · booking page
                    </Body>
                  </div>
                </div>
              </Grow>
              <Grow at={CHAT.you2}>
                <Bubble me u={u}>Looks great. Let's go live!</Bubble>
              </Grow>
              <Grow at={CHAT.eng2}>
                <Bubble u={u}>Done. It's live ✓</Bubble>
              </Grow>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </GlowBg>
  );
};

/* ── 7. Each service, with the quality promise instead of a price ──── */
type ServiceProps = {
  duration: number;
  index: number;
  name: string;
  line: string;
  tag: string;
  visual: React.FC<{ w: number; h: number; u: number }>;
};

export const Service: React.FC<ServiceProps> = ({ duration, index, name, line, tag, visual: Visual }) => {
  const { u, v } = useLayout();
  const frame = useCurrentFrame();
  const vw = (v ? 920 : 820) * u;
  const vh = (v ? 920 : 720) * u;
  return (
    <GlowBg strength={0.9} base={index % 2 ? C.paperDeep : C.paper} style={useExit(duration)}>
      <AbsoluteFill
        style={{
          flexDirection: v ? "column" : "row",
          alignItems: v ? "flex-start" : "center",
          justifyContent: v ? "center" : "space-between",
          padding: v ? `${120 * u}px ${80 * u}px` : `0 ${150 * u}px`,
          gap: (v ? 70 : 60) * u,
        }}
      >
        <div style={{ width: v ? "100%" : 760 * u }}>
          <Eyebrow u={u} color={C.cobalt} style={useEnter(2, 20)}>
            Service {index} of 5
          </Eyebrow>
          <Display size={(v ? 132 : 140) * u} style={{ marginTop: 16 * u, ...useEnter(4, 40) }}>
            {name}
          </Display>
          <Body size={(v ? 44 : 42) * u} style={{ marginTop: 26 * u, maxWidth: 700 * u, ...useEnter(10, 30) }}>
            {line}
          </Body>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14 * u,
              marginTop: 36 * u,
              padding: `${14 * u}px ${28 * u}px ${14 * u}px ${16 * u}px`,
              borderRadius: 999,
              background: "#fff",
              boxShadow: `0 0 0 ${2 * u}px rgba(48,80,240,0.18), 0 ${14 * u}px ${36 * u}px -${14 * u}px rgba(123,92,255,0.55)`,
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 30 * u,
              color: C.ink,
              ...useEnter(18, 24),
            }}
          >
            <span style={{ display: "grid", placeItems: "center", width: 44 * u, height: 44 * u, borderRadius: "50%", background: `linear-gradient(135deg, ${C.cobalt}, ${G.violet})`, color: "#fff", fontSize: 24 * u }}>
              ✓
            </span>
            {tag}
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
              left: vw * 0.06,
              top: vh * 0.04,
              right: vw * 0.02,
              bottom: 0,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: `0 0 0 ${10 * u}px rgba(255,255,255,0.5), 0 ${40 * u}px ${100 * u}px -${30 * u}px rgba(123,92,255,0.45), 0 0 ${120 * u}px rgba(30,200,240,0.25)`,
            }}
          />
          <Visual w={vw} h={vh} u={u} />
        </div>
      </AbsoluteFill>
    </GlowBg>
  );
};

/* ── 8. High quality in every section ─────────────────────────────── */
const QUALITY = ["Mobile-first design", "Fast-loading pages", "SEO-ready structure", "Secure by default", "Clean, hand-written code", "Tested on real screens"];
export const QUALITY_AT = (i: number) => 30 + i * 12;

export const Quality: React.FC<SceneProps> = ({ duration }) => {
  const { u, v } = useLayout();
  const tw = (v ? 448 : 500) * u;
  return (
    <GlowBg strength={1.1} style={useExit(duration)}>
      <Particles n={26} seed="quality" size={5} opacity={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: v ? "flex-start" : "center", padding: `0 ${(v ? 80 : 150) * u}px` }}>
        <Display size={(v ? 116 : 120) * u} style={{ textAlign: v ? "left" : "center", ...useEnter(2, 40) }}>
          High quality <span style={glowText()}>in every section.</span>
        </Display>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${v ? 2 : 3}, ${tw}px)`, gap: 24 * u, marginTop: (v ? 70 : 64) * u }}>
          {QUALITY.map((q, i) => (
            <div key={q} style={useEnter(QUALITY_AT(i) - 6, 30)}>
              <Card u={u} style={{ display: "flex", alignItems: "center", gap: 20 * u, padding: `${(v ? 30 : 30) * u}px ${26 * u}px`, height: (v ? 150 : 128) * u, boxSizing: "border-box" }}>
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    width: 58 * u,
                    height: 58 * u,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.cobalt}, ${G.violet})`,
                    color: "#fff",
                    fontFamily: BODY,
                    fontWeight: 800,
                    fontSize: 30 * u,
                    ...usePop(QUALITY_AT(i)),
                  }}
                >
                  ✓
                </span>
                <Body size={(v ? 32 : 32) * u} color={C.ink} style={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {q}
                </Body>
              </Card>
            </div>
          ))}
        </div>
        <Body size={(v ? 40 : 40) * u} color={C.ink2} style={{ marginTop: (v ? 70 : 60) * u, textAlign: v ? "left" : "center", maxWidth: 1300 * u, textWrap: "balance", ...useEnter(118, 24) }}>
          The price is low because there are no layers. <b style={{ color: C.ink }}>Not because we cut corners.</b>
        </Body>
      </AbsoluteFill>
    </GlowBg>
  );
};
