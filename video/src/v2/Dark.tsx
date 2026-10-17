import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Body, Display, useEnter, useExit } from "../components";
import { BODY, C, EASE, clamp, useLayout } from "../theme";
import { Burst, Eyebrow, G, NightBg, Particles } from "./kit";

type SceneProps = { duration: number };

/* ── 1. The traditional agency: a tall office, screens, many layers ── */
const Tower: React.FC<{ u: number; w: number; h: number }> = ({ u, w, h }) => {
  const frame = useCurrentFrame();
  const cols = 7;
  const rows = 18;
  const tick = Math.floor(frame / 24);
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "linear-gradient(180deg, #1B2340 0%, #10162A 100%)",
        borderRadius: `${10 * u}px ${10 * u}px 0 0`,
        boxShadow: `inset 0 0 0 ${2 * u}px rgba(160,176,214,0.12), 0 0 ${120 * u}px rgba(60,80,160,0.25)`,
        padding: 26 * u,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 12 * u,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => {
        const lit = random(`w-${i}-${tick + (i % 5)}`) > 0.55;
        const warm = random(`c-${i}`) > 0.5;
        return (
          <div
            key={i}
            style={{
              height: (h - 52 * u - (rows - 1) * 12 * u) / rows,
              borderRadius: 3 * u,
              background: lit ? (warm ? "rgba(214,196,150,0.3)" : "rgba(150,170,214,0.26)") : "rgba(160,176,214,0.05)",
            }}
          />
        );
      })}
    </div>
  );
};

/* A generic, unbranded website mock (the agency's work is fine; we don't show real sites) */
const MockSite: React.FC<{ u: number; w: number; h: number; tint: string }> = ({ u, w, h, tint }) => {
  const bar = (wd: string, ht: number, bg: string, mt = 0) => <div style={{ width: wd, height: ht * u, borderRadius: 6 * u, background: bg, marginTop: mt * u }} />;
  return (
    <div style={{ width: w, height: h, borderRadius: 16 * u, overflow: "hidden", background: "#1B2240", boxShadow: `0 ${30 * u}px ${70 * u}px -${20 * u}px rgba(0,0,0,0.7), 0 0 0 ${1.5 * u}px rgba(160,176,214,0.18)` }}>
      <div style={{ height: 34 * u, display: "flex", alignItems: "center", gap: 7 * u, padding: `0 ${14 * u}px`, background: "#232B4A" }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 10 * u, height: 10 * u, borderRadius: "50%", background: "#3E4870" }} />)}
      </div>
      <div style={{ display: "flex", gap: 22 * u, padding: 24 * u }}>
        <div style={{ flex: 1.1 }}>
          {bar("85%", 22, "#4A5584")}
          {bar("65%", 22, "#4A5584", 10)}
          {bar("90%", 9, "#333D63", 18)}
          {bar("70%", 9, "#333D63", 8)}
          {bar("40%", 30, tint, 18)}
        </div>
        <div style={{ flex: 1, height: h * 0.42, borderRadius: 10 * u, background: `linear-gradient(135deg, ${tint}, #2A3358)` }} />
      </div>
      <div style={{ display: "flex", gap: 14 * u, padding: `0 ${24 * u}px` }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: h * 0.2, borderRadius: 10 * u, background: "#262E50" }} />)}
      </div>
    </div>
  );
};

export const AgencyOffice: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const tilt = interpolate(frame, [0, duration], [0, -90 * u]);
  return (
    <NightBg style={useExit(duration, 10)}>
      <Particles n={24} seed="office" colors={["#8E9BC4", "#5B6A9A"]} size={4} speed={0.5} opacity={0.4} />
      <div style={{ position: "absolute", left: (v ? 260 : 1180) * u, top: (v ? 860 : 110) * u, translate: `0px ${tilt}px`, opacity: interpolate(frame, [0, 24], [0, 1], clamp) }}>
        <Tower u={u} w={560 * u} h={1250 * u} />
      </div>
      <div style={{ position: "absolute", left: (v ? 70 : 940) * u, top: (v ? 1180 : 560) * u, rotate: "-4deg", ...useEnter(26, 60, 30) }}>
        <MockSite u={u} w={(v ? 560 : 520) * u} h={(v ? 360 : 330) * u} tint="#5A4F7A" />
      </div>
      <div style={{ position: "absolute", left: (v ? 480 : 1360) * u, top: (v ? 1440 : 720) * u, rotate: "3deg", ...useEnter(40, 60, 30) }}>
        <MockSite u={u} w={(v ? 520 : 440) * u} h={(v ? 330 : 280) * u} tint="#3F5C82" />
      </div>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 220 : 300) * u, width: (v ? 920 : 820) * u }}>
        <Eyebrow u={u} color={G.fogDim} style={useEnter(10, 20)}>
          How most agencies work
        </Eyebrow>
        <Display size={(v ? 124 : 128) * u} color={G.fog} style={{ marginTop: 22 * u, ...useEnter(18, 40, 26) }}>
          Traditional agency model.
        </Display>
        <Body size={(v ? 42 : 40) * u} color={G.fogDim} style={{ marginTop: 30 * u, maxWidth: 760 * u, ...useEnter(52, 24) }}>
          Talented people and impressive offices. And many layers between you and the people who build.
        </Body>
      </div>
    </NightBg>
  );
};

/* ── 2. More layers, more overhead ─────────────────────────────────── */
const LAYERS = [
  { name: "Sales and pitching", tag: "Overhead" },
  { name: "Account management", tag: "Overhead" },
  { name: "Project management", tag: "Overhead" },
  { name: "Office, brand and admin", tag: "Overhead" },
  { name: "Engineering team", tag: "The work" },
];
export const LAYER_AT = (i: number) => 16 + i * 14;
export const DOT_STOPS = [104, 120, 136, 152, 168];

export const Layers: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const cardH = 112 * u;
  const gap = 24 * u;
  const youH = 84 * u;
  const stackW = (v ? 920 : 760) * u;
  /* Message dot hops layer to layer */
  let dotY = youH / 2;
  DOT_STOPS.forEach((at, i) => {
    const target = youH + gap + i * (cardH + gap) + cardH / 2;
    const prev = i === 0 ? youH / 2 : youH + gap + (i - 1) * (cardH + gap) + cardH / 2;
    if (frame >= at - 12) dotY = interpolate(frame, [at - 12, at], [prev, target], { ...clamp, easing: EASE });
  });
  const dotOn = interpolate(frame, [86, 92], [0, 1], clamp);

  return (
    <NightBg style={useExit(duration, 10)}>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 180 : 300) * u, width: (v ? 920 : 760) * u }}>
        <Display size={(v ? 132 : 132) * u} color={G.fog} style={useEnter(2, 40)}>
          More layers.
        </Display>
        <Display size={(v ? 132 : 132) * u} color={G.fogDim} style={useEnter(12, 40)}>
          More overhead.
        </Display>
        <Body size={(v ? 40 : 38) * u} color={G.fogDim} style={{ marginTop: 34 * u, ...useEnter(150, 24) }}>
          Your message passes through every layer. So does your budget.
        </Body>
      </div>
      <div style={{ position: "absolute", left: (v ? 80 : 1010) * u, top: (v ? 700 : 150) * u, width: stackW }}>
        {/* the line every request travels down */}
        <div style={{ position: "absolute", left: 56 * u, top: youH / 2, width: 3 * u, height: interpolate(frame, [16, 90], [0, youH + gap + 4 * (cardH + gap) + cardH / 2 - youH / 2], clamp), background: "rgba(160,176,214,0.25)" }} />
        <div
          style={{
            height: youH,
            width: 220 * u,
            borderRadius: 999,
            background: "#E9EDF7",
            display: "flex",
            alignItems: "center",
            gap: 14 * u,
            paddingLeft: 30 * u,
            fontFamily: BODY,
            fontWeight: 750,
            fontSize: 32 * u,
            color: G.night,
            position: "relative",
            ...useEnter(6, 20),
          }}
        >
          <span style={{ width: 28 * u, height: 28 * u, borderRadius: "50%", background: C.cobalt }} />
          You
        </div>
        {LAYERS.map((l, i) => {
          const work = i === LAYERS.length - 1;
          const lit = frame >= DOT_STOPS[i];
          return (
            <div
              key={l.name}
              style={{
                position: "relative",
                marginTop: gap,
                height: cardH,
                borderRadius: 20 * u,
                background: G.nightCard,
                boxShadow: `inset 0 0 0 ${2 * u}px ${work ? "rgba(98,124,255,0.55)" : lit ? "rgba(201,208,224,0.35)" : G.nightLine}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${34 * u}px 0 ${100 * u}px`,
                ...useEnter(LAYER_AT(i), -50, 16),
              }}
            >
              <span style={{ position: "absolute", left: 46 * u, width: 23 * u, height: 23 * u, borderRadius: "50%", background: work ? "#6E86FF" : "#3A4466" }} />
              <span style={{ fontFamily: BODY, fontWeight: 650, fontSize: 34 * u, color: work ? "#E9EDF7" : G.fog }}>{l.name}</span>
              <span
                style={{
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 22 * u,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: work ? "#9FB0FF" : G.fogDim,
                }}
              >
                {l.tag}
              </span>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 57.5 * u - 15 * u,
            top: dotY - 15 * u,
            width: 30 * u,
            height: 30 * u,
            borderRadius: "50%",
            background: "#8EA2FF",
            boxShadow: `0 0 ${30 * u}px #6E86FF`,
            opacity: dotOn,
          }}
        />
      </div>
    </NightBg>
  );
};

/* ── 3. The question that turns the lights on ──────────────────────── */
export const Question: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const dawn = interpolate(frame, [110, duration], [0, 1], clamp);
  return (
    <NightBg>
      <Particles n={30} seed="q" colors={["#8E9BC4", G.cyan]} size={4} speed={0.6} opacity={0.35 + dawn * 0.4} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 50% 55%, rgba(30,200,240,${0.22 * dawn}) 0%, transparent 70%)` }} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: v ? "flex-start" : "center",
          padding: `0 ${(v ? 80 : 150) * u}px`,
          textAlign: v ? "left" : "center",
          scale: String(interpolate(frame, [0, duration], [1, 1.05])),
        }}
      >
        <Display size={(v ? 118 : 120) * u} color={G.fog} style={useEnter(4, 40)}>
          What if you could skip the layers,
        </Display>
        <Display size={(v ? 118 : 120) * u} color="#fff" style={{ marginTop: 10 * u, ...useEnter(34, 40) }}>
          and work{" "}
          <span
            style={{
              backgroundImage: `linear-gradient(100deg, #8EA2FF, ${G.cyan})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 ${18 * u * dawn}px rgba(30,200,240,0.6))`,
            }}
          >
            directly with the engineers?
          </span>
        </Display>
      </AbsoluteFill>
    </NightBg>
  );
};

/* ── 4. The light streak: dark becomes bright ──────────────────────── */
export const Transition: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, width, height, v } = useLayout();
  const head = interpolate(frame, [2, 30], [-0.2, 1.25], { ...clamp, easing: EASE }) * width;
  const head2 = interpolate(frame, [14, 40], [1.25, -0.2], { ...clamp, easing: EASE }) * width;
  const flash = interpolate(frame, [38, duration], [0, 1], { ...clamp, easing: (t) => t * t });
  const r = Math.hypot(width, height) * 0.6 * flash;
  const line = (x: number, y: number, dir: 1 | -1, color: string, thick: number) => (
    <div
      style={{
        position: "absolute",
        top: y - (thick * u) / 2,
        left: dir === 1 ? x - width * 0.7 : x,
        width: width * 0.7,
        height: thick * u,
        borderRadius: 99,
        background: `linear-gradient(${dir === 1 ? 90 : 270}deg, transparent, ${color} 75%, #fff)`,
        boxShadow: `0 0 ${30 * u}px ${color}, 0 0 ${80 * u}px ${color}`,
      }}
    />
  );
  return (
    <AbsoluteFill>
    <NightBg>
      {line(head, height * (v ? 0.46 : 0.5), 1, G.cyan, 8)}
      {line(head2, height * (v ? 0.54 : 0.53), -1, G.violet, 5)}
      <Burst at={34} x={width / 2} y={height / 2} n={90} seed="flash" reach={0.9} />
    </NightBg>
      <div
        style={{
          position: "absolute",
          left: width / 2 - r,
          top: height / 2 - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, #ffffff 0%, ${C.paper} 55%, rgba(30,200,240,0.6) 80%, rgba(123,92,255,0) 100%)`,
          scale: String(1 + flash * 0.8),
        }}
      />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [duration - 8, duration], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};
