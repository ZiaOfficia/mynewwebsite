import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { HI_BUBBLE, HI_LETTERS, HI_VIEWBOX } from "../hiPaths";
import { BODY, DISPLAY, clamp } from "../theme";
import { Dust, Headline, K, Label, LightLine, Midnight, ease, linesFor } from "./fx";

type P = { duration: number };
const sp = (frame: number, at: number, damping = 14, stiffness = 140) => spring({ frame: frame - at, fps: 30, config: { damping, stiffness } });

/* ── The world of scenes 1 and 2: a storefront and its data, behind glass ── */
const NODES = [
  [320, 300], [520, 230], [640, 420], [420, 610], [760, 640], [1700, 300], [1760, 520], [1580, 700], [880, 260], [1000, 720],
] as const;
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [2, 8], [5, 6], [6, 7], [4, 9], [8, 5]] as const;
const PANES = [880, 1150, 1420];

const World: React.FC<{ lit: number; shatter: number; impactX: number; offset?: number }> = ({ lit, shatter, impactX, offset = 0 }) => {
  const frame = useCurrentFrame() + offset;
  const draw = ease(frame, 18, 60);
  const stroke = lit > 0 ? `rgba(${Math.round(160 - 130 * lit)},${Math.round(176 + 24 * lit)},${Math.round(214 + 26 * lit)},${0.35 + 0.5 * lit})` : "rgba(160,176,214,0.35)";
  return (
    <>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* links: broken and flickering, then whole and glowing */}
        {LINKS.map(([a, b], i) => {
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          const flick = 0.25 + 0.35 * Math.abs(Math.sin(frame / (6 + i) + i));
          const join = ease(frame, 40 + i * 4, 60 + i * 4) * lit;
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(160,176,214,0.5)" strokeWidth={2} strokeDasharray={`${len * 0.28} ${len * 0.44}`} opacity={flick * (1 - join)} />
              <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * join} y2={y1 + (y2 - y1) * join} stroke={K.cyan} strokeWidth={3} opacity={join} style={{ filter: `drop-shadow(0 0 6px ${K.cyan})` }} />
            </g>
          );
        })}
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7 + lit * 3} fill={lit > 0.5 ? K.cyan : "rgba(160,176,214,0.6)"} opacity={0.5 + 0.5 * lit} style={{ filter: lit > 0.3 ? `drop-shadow(0 0 10px ${K.cyan})` : "none" }} />
        ))}
        {/* storefront line art */}
        <g fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" pathLength={1} style={{ filter: lit > 0.2 ? `drop-shadow(0 0 ${8 * lit}px ${K.cyan})` : "none" }}>
          {[
            "M1040,760 L1040,430 L1640,430 L1640,760",
            "M1010,430 L1670,430 L1640,360 L1040,360 Z",
            "M1040,430 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0",
            "M1100,500 L1300,500 L1300,680 L1100,680 Z",
            "M1380,500 L1560,500 L1560,760 L1380,760",
            "M1120,300 L1560,300 L1560,350 L1120,350 Z",
          ].map((d, i) => (
            <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          ))}
        </g>
        {/* dashboard on the left */}
        <g opacity={0.9}>
          <rect x={250} y={430} width={420} height={270} rx={14} fill={lit > 0 ? `rgba(48,80,240,${0.12 * lit})` : "none"} stroke={stroke} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const hh = (lit > 0 ? 40 + i * 22 * ease(frame, 50 + i * 4, 70 + i * 4) : 20 + random(`b${i}`) * 40) as number;
            return <rect key={i} x={290 + i * 60} y={670 - hh} width={34} height={hh} rx={4} fill={lit > 0.4 ? (i === 5 ? K.gold : K.electric) : "rgba(160,176,214,0.25)"} opacity={draw} />;
          })}
        </g>
        {/* horizon */}
        <line x1={0} y1={760} x2={1920} y2={760} stroke="rgba(160,176,214,0.18)" strokeWidth={2} opacity={draw} />
      </svg>
      {/* glass panes, which shatter in scene 2 */}
      {PANES.map((x, p) =>
        Array.from({ length: 15 }).map((_, k) => {
          const col = k % 3;
          const row = Math.floor(k / 3);
          const w = 250 / 3;
          const h = 560 / 5;
          const px = x + col * w;
          const py = 220 + row * h;
          const r = (s: string) => random(`pane${p}${k}${s}`);
          const dir = Math.sign(px + w / 2 - impactX) || 1;
          const t = Math.max(0, shatter - r("d") * 0.15);
          const dx = dir * (120 + r("x") * 500) * t;
          const dy = (-200 + r("y") * 500) * t + 300 * t * t;
          const rot = (r("r") - 0.5) * 160 * t;
          const appear = ease(frame, 26 + p * 6, 50 + p * 6);
          const jit = (s: string) => Math.round((r(s) - 0.5) * 18);
          return (
            <div
              key={`${p}${k}`}
              style={{
                position: "absolute",
                left: px,
                top: py,
                width: w,
                height: h,
                background: shatter > 0 ? `linear-gradient(135deg, rgba(190,210,255,${0.1 + 0.05 * (k % 2)}), rgba(160,180,240,0.03))` : `linear-gradient(${135}deg, rgba(190,210,255,${0.11 - row * 0.012}), rgba(170,190,245,${0.08 - row * 0.01}))`,
                boxShadow: shatter > 0 ? "inset 0 0 0 1px rgba(210,225,255,0.16)" : "none",
                clipPath: shatter <= 0 ? undefined : `polygon(${jit("a")}px ${jit("b")}px, calc(100% + ${jit("c")}px) ${jit("d")}px, calc(100% + ${jit("e")}px) calc(100% + ${jit("f")}px), ${jit("g")}px calc(100% + ${jit("h")}px))`,
                translate: `${dx}px ${dy + (1 - appear) * 120}px`,
                rotate: `${rot}deg`,
                opacity: appear * (1 - Math.min(1, t * 1.3)),
              }}
            />
          );
        }),
      )}
      {PANES.map((x, p) => (
        <div key={`f${p}`} style={{ position: "absolute", left: x, top: 220, width: 250, height: 560, borderRadius: 6, boxShadow: "inset 0 0 0 1.5px rgba(210,225,255,0.22)", opacity: ease(frame, 26 + p * 6, 50 + p * 6) * (shatter > 0 ? 0 : 1) }} />
      ))}
      {PANES.map((x, p) => (
        <div key={p} style={{ position: "absolute", left: x + 30, top: 240, width: 26, height: 500, rotate: "18deg", background: "linear-gradient(180deg, rgba(255,255,255,0.12), transparent)", opacity: ease(frame, 30 + p * 6, 54 + p * 6) * (1 - Math.min(1, shatter * 2)) }} />
      ))}
    </>
  );
};

/* ── 1. The struggle ─────────────────────────────────────────────────── */
export const Struggle: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("struggle");
  const grow = ease(frame, 2, 24);
  const drop = ease(frame, 22, 46);
  return (
    <AbsoluteFill style={{ background: K.midnight }}>
      <AbsoluteFill style={{ opacity: ease(frame, 14, 40), filter: "saturate(0.6)" }}>
        <Midnight glow="#3A4A7A" glowX={70} glowY={50} glowAlpha={0.2}>
          <AbsoluteFill style={{ scale: String(interpolate(frame, [0, duration], [1, 1.05])) }}>
            <World lit={0} shatter={0} impactX={0} />
          </AbsoluteFill>
        </Midnight>
      </AbsoluteFill>
      <LightLine x={960} y={540 + drop * 220} w={1500 * grow} color={K.electric} thick={2 + (1 - drop) * 2} opacity={1 - drop * 0.75} />
      <div style={{ position: "absolute", left: 140, top: 150, width: 900 }}>
        <Headline {...L[0]} size={150} align="left" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 150, width: 1100 }}>
        <Headline {...L[1]} size={150} align="left" color={K.mist} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 2. The world changes ────────────────────────────────────────────── */
export const Shift: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("shift");
  const beamX = interpolate(frame, [4, 22], [-300, 2200], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const shatter = interpolate(frame, [14, 44], [0, 1], clamp);
  const lit = ease(frame, 16, 46);
  const collapse = ease(frame, duration - 22, duration);
  return (
    <AbsoluteFill style={{ background: K.midnight }}>
      <AbsoluteFill style={{ scale: String(interpolate(collapse, [0, 1], [1.05, 0.6])), opacity: 1 - collapse, filter: `saturate(${0.6 + 0.6 * lit})` }}>
        <Midnight glow={K.violet} glowX={60} glowY={50} glowSize={70} glowAlpha={0.15 + 0.35 * lit}>
          <AbsoluteFill style={{ background: `radial-gradient(60% 60% at 30% 60%, ${K.cobalt}55, transparent 70%)`, opacity: lit }} />
          <World lit={lit} shatter={shatter} impactX={beamX} offset={144} />
          {/* interface cards assemble around the storefront */}
          {[
            { x: 1070, y: 170, w: 250, t: "Online orders", c: K.cyan },
            { x: 1450, y: 170, w: 230, t: "Bookings", c: K.violet },
            { x: 1690, y: 400, w: 190, t: "Reviews", c: K.gold },
          ].map((c, i) => {
            const p = sp(frame, 44 + i * 8, 13, 150);
            return (
              <div
                key={c.t}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  width: c.w,
                  padding: "14px 18px",
                  borderRadius: 14,
                  background: "rgba(14,20,48,0.8)",
                  boxShadow: `0 0 0 1.5px ${c.c}88, 0 0 30px ${c.c}55`,
                  fontFamily: BODY,
                  fontWeight: 650,
                  fontSize: 24,
                  color: K.white,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  scale: String(interpolate(p, [0, 1], [0.5, 1])),
                  opacity: frame >= 44 + i * 8 ? 1 : 0,
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: c.c, boxShadow: `0 0 12px ${c.c}` }} />
                {c.t}
              </div>
            );
          })}
          <Dust n={30} seed="shift" opacity={0.5 * lit} />
        </Midnight>
      </AbsoluteFill>
      {/* the beam */}
      <div style={{ position: "absolute", left: beamX - 60, top: -100, width: 120, height: 1280, rotate: "12deg", background: `linear-gradient(90deg, transparent, ${K.cyan}66 35%, #fff 50%, ${K.cyan}66 65%, transparent)`, filter: "blur(6px)", opacity: interpolate(frame, [4, 8, 20, 26], [0, 1, 1, 0], clamp) }} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [12, 16, 26], [0, 0.35, 0], clamp) }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 830, opacity: 1 - collapse }}>
        <Headline {...L[0]} size={104} accent={["out", "of", "reach"]} accentColor={K.cyan} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 3. The HiBrands reveal: traced, lit, resolved ───────────────────── */
export const HiMarkAnimated: React.FC<{ size: number; frame: number; final?: boolean }> = ({ size, frame, final }) => {
  const trace = final ? 1 : ease(frame, 2, 38);
  const traceL = final ? 1 : ease(frame, 14, 44);
  const mono = final ? 1 : ease(frame, 36, 46);
  const blue = final ? 1 : ease(frame, 48, 58);
  const grad = final ? 1 : ease(frame, 60, 70);
  const off = final ? 1 : ease(frame, 72, 76);
  const sweepX = interpolate(frame, [40, 58, 74, 96], [-40, 120, -40, 120], clamp);
  const glint = interpolate(frame, [74, 96], [-30, 120], clamp);
  const id = `hm${size}`;
  return (
    <svg viewBox={HI_VIEWBOX} width={size} height={size * (88.14 / 86)} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={HI_BUBBLE} />
        </clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={K.violet} />
          <stop offset="1" stopColor={K.cyan} />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.85} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* fills, layered: white → electric blue → violet-cyan → official marigold */}
      <path d={HI_BUBBLE} fill="#fff" opacity={mono * (1 - off)} />
      <path d={HI_BUBBLE} fill={K.electric} opacity={blue * (1 - off)} />
      <path d={HI_BUBBLE} fill={`url(#${id}g)`} opacity={grad * (1 - off)} />
      <path d={HI_BUBBLE} fill={K.gold} opacity={off} />
      <path d={HI_LETTERS} fill={off > 0.5 ? K.cobalt : mono > 0.5 && blue < 0.5 ? K.midnight : "#fff"} opacity={mono} />
      {/* light sweeps, clipped to the bubble */}
      {!final ? (
        <g clipPath={`url(#${id}c)`}>
          <rect x={sweepX - 20} y={-10} width={40} height={110} fill={`url(#${id}s)`} opacity={frame > 40 && frame < 96 ? 0.8 : 0} transform="rotate(18 43 44)" />
          <rect x={glint - 12} y={-10} width={24} height={110} fill="#FFF3C4" opacity={frame > 74 && frame < 96 ? 0.9 : 0} transform="rotate(18 43 44)" />
        </g>
      ) : null}
      {/* the tracing line */}
      <path d={HI_BUBBLE} fill="none" stroke="#fff" strokeWidth={0.7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trace} opacity={1 - mono * 0.9} style={{ filter: `drop-shadow(0 0 1.2px ${K.cyan})` }} />
      <path d={HI_LETTERS} fill="none" stroke="#fff" strokeWidth={0.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traceL} opacity={1 - mono} />
    </svg>
  );
};

export const Reveal: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("reveal");
  const hit = interpolate(frame, [72, 74, 100], [0, 1, 0], clamp);
  const settle = interpolate(frame, [72, duration], [1, 0.94], clamp);
  return (
    <AbsoluteFill style={{ background: K.midnight }}>
      <Midnight glow={frame < 60 ? K.electric : frame < 72 ? K.violet : K.gold} glowX={50} glowY={42} glowSize={40} glowAlpha={0.12 + 0.25 * ease(frame, 30, 72)}>
        <Dust n={26} seed="reveal" size={3} opacity={0.35 * ease(frame, 72, 100)} colors={[K.gold, "#fff", K.cyan]} />
      </Midnight>
      {/* rings at the moment of impact */}
      {[0, 1, 2].map((i) => {
        const t = interpolate(frame, [72 + i * 5, 120 + i * 5], [0, 1], clamp);
        return <div key={i} style={{ position: "absolute", left: 960, top: 440, width: 300 + t * 900, height: 300 + t * 900, translate: "-50% -50%", borderRadius: "50%", border: `2px solid ${i === 1 ? K.cyan : K.gold}`, opacity: (1 - t) * 0.5 * (frame >= 72 + i * 5 ? 1 : 0) }} />;
      })}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 440,
          translate: "-50% -50%",
          scale: String(settle * (1 + hit * 0.04)),
          filter: `drop-shadow(0 0 ${20 + hit * 60}px ${frame >= 72 ? "rgba(255,200,61,0.55)" : "rgba(77,123,255,0.5)"})`,
        }}
      >
        <HiMarkAnimated size={340} frame={frame} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 700 }}>
        <Headline {...L[0]} size={96} accent={["HiBrands"]} accentColor={K.gold} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 700 }}>
        <Headline {...L[1]} size={84} accent={["digital", "growth"]} accentColor={K.cyan} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 4. Engineers who build: six glass panels in depth ───────────────── */
const Glass: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
  <div style={{ width: 360, height: 250, borderRadius: 18, background: "rgba(12,18,44,0.82)", boxShadow: `0 0 0 1.5px ${color}66, 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 50px ${color}22`, overflow: "hidden", position: "relative" }}>
    <div style={{ height: 38, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: "1px solid rgba(160,176,214,0.15)" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
      <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 17, color: K.white, letterSpacing: "0.04em" }}>{title}</span>
    </div>
    <div style={{ position: "relative", height: 212, padding: 16 }}>{children}</div>
  </div>
);

const Bar: React.FC<{ w: string; c?: string; h?: number; mt?: number }> = ({ w, c = "rgba(160,176,214,0.25)", h = 10, mt = 10 }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: c, marginTop: mt }} />;

const PanelContent: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  if (i === 0) {
    const code = [
      [K.violet, "const", K.white, " site = build({"],
      [K.cyan, "  pages", K.white, ": [home, shop, contact],"],
      [K.cyan, "  mobile", K.white, ": true,"],
      [K.cyan, "  speed", K.white, ": \"fast\","],
      [K.white, "});", K.gold, " // ship it"],
    ];
    const shown = Math.floor(interpolate(frame, [10, 90], [0, 5 * 26], clamp));
    let left = shown;
    return (
      <div style={{ fontFamily: "monospace", fontSize: 17, lineHeight: 1.7 }}>
        {code.map((l, k) => {
          const txt = (l[1] as string) + (l[3] as string);
          const n = Math.max(0, Math.min(txt.length, left));
          left -= txt.length;
          const a = (l[1] as string).slice(0, n);
          const b = (l[3] as string).slice(0, Math.max(0, n - (l[1] as string).length));
          return (
            <div key={k}>
              <span style={{ color: l[0] as string }}>{a}</span>
              <span style={{ color: l[2] as string }}>{b}</span>
            </div>
          );
        })}
      </div>
    );
  }
  if (i === 1)
    return (
      <div>
        <div style={{ height: 70, borderRadius: 10, background: `linear-gradient(120deg, ${K.cobalt}, ${K.violet})`, padding: 12 }}>
          <Bar w="60%" c="rgba(255,255,255,0.85)" h={12} mt={0} />
          <Bar w="40%" c="rgba(255,255,255,0.5)" h={8} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10 }}>
          {[K.gold, K.cyan, K.coral].map((c) => (
            <div key={c} style={{ height: 70, borderRadius: 8, background: "rgba(255,255,255,0.06)", padding: 6 }}>
              <div style={{ height: 34, borderRadius: 6, background: c, opacity: 0.85 }} />
              <Bar w="70%" h={6} mt={8} />
            </div>
          ))}
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: 24, color: K.white }}>Book a free visit</div>
        {[0, 1].map((k) => (
          <div key={k} style={{ height: 34, borderRadius: 8, border: `1.5px solid ${frame > 40 + k * 14 ? K.cyan : "rgba(160,176,214,0.3)"}`, marginTop: 10 }} />
        ))}
        <div style={{ height: 40, borderRadius: 99, background: frame > 80 ? K.gold : K.electric, marginTop: 12, display: "grid", placeItems: "center", fontFamily: BODY, fontWeight: 750, fontSize: 17, color: frame > 80 ? K.ink : "#fff" }}>
          {frame > 80 ? "Booked ✓" : "Book now"}
        </div>
      </div>
    );
  if (i === 3) {
    const climb = ease(frame, 40, 70);
    return (
      <div>
        <div style={{ height: 32, borderRadius: 99, background: "rgba(255,255,255,0.08)", padding: "0 14px", display: "flex", alignItems: "center", fontFamily: BODY, fontSize: 16, color: K.mist }}>best bakery near me</div>
        <div style={{ position: "relative", height: 150, marginTop: 10 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "absolute", left: 0, right: 0, top: interpolate(climb, [0, 1], [k * 46, (k + 1) * 46]), height: 38, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: BODY, fontSize: 15, color: K.mist, width: 18 }}>{climb > 0.5 ? k + 2 : k + 1}</span>
              <Bar w="70%" mt={0} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(climb, [0, 1], [3 * 46, 0]), height: 40, borderRadius: 8, background: "rgba(255,200,61,0.16)", boxShadow: `inset 0 0 0 1.5px ${K.gold}`, display: "flex", alignItems: "center", gap: 10, padding: "0 8px", fontFamily: BODY, fontWeight: 700, fontSize: 16, color: K.white }}>
            <span style={{ color: K.gold }}>{climb > 0.5 ? 1 : 4}</span> yourbakery.in
          </div>
        </div>
      </div>
    );
  }
  if (i === 4) {
    const likes = Math.round(interpolate(frame, [30, 100], [12, 486], clamp));
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 150, height: 150, borderRadius: 12, background: `linear-gradient(135deg, ${K.coral}, ${K.gold})` }} />
        <div style={{ flex: 1 }}>
          <Bar w="80%" mt={0} />
          <Bar w="60%" />
          <div style={{ marginTop: 18, fontFamily: BODY, fontWeight: 750, fontSize: 22, color: K.white }}>
            <span style={{ color: K.coral }}>♥</span> {likes}
          </div>
        </div>
      </div>
    );
  }
  const bars = [30, 42, 38, 55, 64, 80, 96];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 170 }}>
      {bars.map((b, k) => (
        <div key={k} style={{ flex: 1, height: `${b * ease(frame, 20 + k * 6, 34 + k * 6)}%`, borderRadius: "6px 6px 2px 2px", background: k === bars.length - 1 ? K.gold : `linear-gradient(180deg, ${K.cyan}, ${K.electric})` }} />
      ))}
    </div>
  );
};

const SERVICES = [
  { t: "Engineering", c: K.violet },
  { t: "Websites", c: K.electric },
  { t: "Landing pages", c: K.cyan },
  { t: "SEO", c: K.gold },
  { t: "Social media", c: K.coral },
  { t: "Google Ads", c: K.cyan },
];
const SLOTS = [
  [760, 210], [1150, 160], [1540, 230], [800, 560], [1190, 610], [1560, 560],
];

const ICONS: Record<string, React.ReactNode> = {
  Websites: <path d="M4 6h24v18H4z M4 11h24 M8 8.5h1 M11 8.5h1" />,
  "Landing pages": <path d="M7 4h18v24H7z M11 10h10 M11 15h10 M11 21h6" />,
  SEO: <path d="M14 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M20 20l7 7" />,
  "Social media": <path d="M16 27s-10-6-10-13a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 7-10 13-10 13z" />,
  "Google Ads": <path d="M5 26h22 M8 22v-6 M14 22V10 M20 22v-9 M26 22V6" />,
};

export const Engineers: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const L = linesFor("engineers");
  const recede = ease(frame, 148, 168);
  return (
    <AbsoluteFill>
      <Midnight glow={K.violet} glowX={68} glowY={45} glowSize={60} glowAlpha={0.28}>
        <AbsoluteFill style={{ background: `radial-gradient(40% 50% at 85% 80%, ${K.cobalt}44, transparent 70%)` }} />
        <Dust n={30} seed="eng" opacity={0.4} />
      </Midnight>
      {/* pathways between panels */}
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - recede * 0.8 }}>
        {[[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5], [1, 4]].map(([a, b], i) => {
          const [x1, y1] = SLOTS[a];
          const [x2, y2] = SLOTS[b];
          const t = ease(frame, 20 + i * 6, 44 + i * 6);
          const ax = x1 + 180, ay = y1 + 125, bx = x2 + 180, by = y2 + 125;
          const pulse = ((frame * 0.02 + i * 0.17) % 1);
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={ax + (bx - ax) * t} y2={ay + (by - ay) * t} stroke={K.cyan} strokeWidth={2} opacity={0.45} />
              {t >= 1 ? <circle cx={ax + (bx - ax) * pulse} cy={ay + (by - ay) * pulse} r={4} fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${K.cyan})` }} /> : null}
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ perspective: 1800, opacity: 1 - recede * 0.93, scale: String(1 - recede * 0.1), filter: `blur(${recede * 6}px)` }}>
        {SERVICES.map((s, i) => {
          const [x, y] = SLOTS[i];
          const p = sp(frame, 4 + i * 7, 15, 120);
          const drift = Math.sin(frame / 40 + i) * 8;
          return (
            <div
              key={s.t}
              style={{
                position: "absolute",
                left: x,
                top: y + drift,
                transform: `rotateY(${(i % 3 === 0 ? 14 : i % 3 === 2 ? -14 : 0) + Math.sin(frame / 60 + i) * 3}deg) rotateX(${i < 3 ? 6 : -6}deg) translateZ(${interpolate(p, [0, 1], [-500, 0])}px)`,
                opacity: interpolate(frame, [4 + i * 7, 12 + i * 7], [0, 1], clamp),
              }}
            >
              <Glass title={s.t} color={s.c}>
                <PanelContent i={i} />
              </Glass>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* left scrim for the headline */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,7,15,0.92) 0%, rgba(5,7,15,0.6) 30%, transparent 45%)", opacity: 1 - recede }} />
      <div style={{ position: "absolute", left: 110, top: 380, width: 620 }}>
        <Headline {...L[0]} size={100} align="left" accent={["engineers"]} accentColor={K.cyan} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 380, width: 640 }}>
        <Headline {...L[1]} size={92} align="left" accent={["real", "businesses"]} accentColor={K.gold} />
      </div>
      {/* the last beat: five services today, more slots waiting */}
      <AbsoluteFill style={{ background: "rgba(5,7,15,0.7)", opacity: recede }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 250 }}>
        <Headline {...L[2]} size={84} accent={["Much", "more", "on", "the", "way"]} accentColor={K.cyan} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 26, opacity: recede }}>
        {["Websites", "Landing pages", "SEO", "Social media", "Google Ads", "+", "+", "+"].map((s, i) => {
          const ghost = s === "+";
          const p = sp(frame, 156 + i * 4, 12, 160);
          return (
            <div key={i} style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, scale: String(interpolate(p, [0, 1], [0.5, 1])), opacity: frame >= 156 + i * 4 ? (ghost ? 0.45 + 0.35 * Math.abs(Math.sin(frame / 8 + i)) : 1) : 0 }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 26,
                  display: "grid",
                  placeItems: "center",
                  background: ghost ? "transparent" : "rgba(14,20,48,0.9)",
                  border: ghost ? `2px dashed ${K.cyan}` : "none",
                  boxShadow: ghost ? "none" : `0 0 0 1.5px ${K.electric}88, 0 0 30px ${K.electric}44`,
                  color: ghost ? K.cyan : K.white,
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 54,
                }}
              >
                {ghost ? (
                  "+"
                ) : (
                  <svg viewBox="0 0 32 32" width={52} height={52} fill="none" stroke={K.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[s]}
                  </svg>
                )}
              </div>
              <div style={{ fontFamily: BODY, fontWeight: 650, fontSize: 20, color: ghost ? K.cyan : K.mist, textAlign: "center" }}>{ghost ? "Coming" : s}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ── 5. Premium services, local prices ───────────────────────────────── */
const ASSETS = [
  { kind: "site", c: K.electric },
  { kind: "palette", c: K.gold },
  { kind: "mark", c: K.violet },
  { kind: "post", c: K.coral },
  { kind: "chart", c: K.cyan },
  { kind: "landing", c: K.electric },
  { kind: "search", c: K.gold },
  { kind: "card", c: K.violet },
];

const Asset: React.FC<{ kind: string; c: string }> = ({ kind, c }) => {
  const base: React.CSSProperties = { width: 300, height: 190, borderRadius: 16, background: "rgba(14,20,48,0.9)", boxShadow: `0 0 0 1.5px ${c}77`, overflow: "hidden", position: "relative", padding: 14 };
  if (kind === "palette")
    return (
      <div style={{ ...base, display: "flex", gap: 8 }}>
        {[K.gold, K.cobalt, K.violet, K.cyan, K.coral].map((x) => <div key={x} style={{ flex: 1, borderRadius: 8, background: x }} />)}
      </div>
    );
  if (kind === "mark")
    return (
      <div style={{ ...base, display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${K.violet}, ${K.cobalt})` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, color: "#fff", letterSpacing: "-0.04em" }}>Aa</div>
      </div>
    );
  if (kind === "post")
    return (
      <div style={{ ...base, display: "flex", gap: 10 }}>
        <div style={{ width: 160, borderRadius: 10, background: `linear-gradient(135deg, ${K.coral}, ${K.gold})` }} />
        <div style={{ flex: 1 }}>
          <Bar w="90%" mt={0} />
          <Bar w="60%" />
          <div style={{ marginTop: 16, color: K.coral, fontSize: 28 }}>♥</div>
        </div>
      </div>
    );
  if (kind === "chart")
    return (
      <div style={{ ...base, display: "flex", alignItems: "flex-end", gap: 8 }}>
        {[30, 45, 40, 60, 72, 90].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 6, background: i === 5 ? K.gold : K.cyan }} />)}
      </div>
    );
  if (kind === "search")
    return (
      <div style={base}>
        <div style={{ height: 30, borderRadius: 99, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ height: 44, borderRadius: 10, marginTop: 12, boxShadow: `inset 0 0 0 1.5px ${K.gold}`, background: "rgba(255,200,61,0.12)" }} />
        <Bar w="80%" />
        <Bar w="60%" />
      </div>
    );
  if (kind === "card")
    return (
      <div style={{ ...base, background: `linear-gradient(135deg, #1A2150, #0E1430)` }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: K.gold }} />
        <Bar w="55%" c="rgba(255,255,255,0.7)" h={12} mt={20} />
        <Bar w="40%" />
      </div>
    );
  if (kind === "landing")
    return (
      <div style={base}>
        <Bar w="70%" c="rgba(255,255,255,0.8)" h={14} mt={0} />
        <div style={{ height: 28, borderRadius: 8, border: `1.5px solid ${K.cyan}`, marginTop: 14 }} />
        <div style={{ height: 32, borderRadius: 99, background: K.gold, marginTop: 12, width: "60%" }} />
      </div>
    );
  return (
    <div style={base}>
      <div style={{ height: 60, borderRadius: 10, background: `linear-gradient(120deg, ${K.cobalt}, ${K.violet})` }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10 }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ height: 70, borderRadius: 8, background: "rgba(255,255,255,0.07)" }} />)}
      </div>
    </div>
  );
};

export const Premium: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("premium");
  const slice = ease(frame, 72, 90);
  const lock = ease(frame, 144, 168);
  const collapse = ease(frame, duration - 16, duration);
  const cols = 4;
  return (
    <AbsoluteFill>
      <Midnight glow={frame < 72 ? "#5A4A2A" : K.violet} glowX={50} glowY={60} glowSize={70} glowAlpha={0.2 + 0.15 * slice}>
        <Dust n={24} seed="prem" colors={[K.gold, K.cyan]} opacity={0.35 * slice} />
      </Midnight>
      {/* the assets: scattered and blurred behind glass, then locked into one ecosystem */}
      <AbsoluteFill style={{ scale: String(1 - collapse * 0.7), opacity: 1 - collapse }}>
        {ASSETS.map((a, i) => {
          const r = (k: string) => random(`as${i}${k}`);
          const sx = 280 + r("x") * 1100;
          const sy = 330 + r("y") * 380;
          const gx = 960 - (cols * 330) / 2 + (i % cols) * 330;
          const gy = 410 + Math.floor(i / cols) * 230;
          const x = interpolate(lock, [0, 1], [sx, gx]);
          const y = interpolate(lock, [0, 1], [sy, gy]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                rotate: `${(1 - lock) * (r("r") - 0.5) * 16}deg`,
                filter: `blur(${(1 - slice) * 14}px) brightness(${0.55 + 0.45 * slice})`,
                scale: String(0.88 + 0.12 * slice),
                boxShadow: lock > 0.8 ? `0 0 40px ${a.c}55` : "none",
                borderRadius: 16,
              }}
            >
              <Asset kind={a.kind} c={a.c} />
            </div>
          );
        })}
        {/* gold threads that join the ecosystem */}
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lock }}>
          {[0, 1, 2, 3].map((c) => (
            <line key={c} x1={960 - 660 + c * 330 + 150} y1={600} x2={960 - 660 + c * 330 + 150} y2={640} stroke={K.gold} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${K.gold})` }} />
          ))}
          <line x1={960 - 660 + 300} y1={505} x2={960 + 660 - 330} y2={505} stroke={K.gold} strokeWidth={2} opacity={0.5} />
        </svg>
      </AbsoluteFill>
      {/* frosted glass with a gold line, sliced open on "Local prices." */}
      {[0, 1].map((half) => (
        <div
          key={half}
          style={{
            position: "absolute",
            left: 200,
            width: 1520,
            top: half === 0 ? 300 : 600,
            height: 300,
            background: "linear-gradient(180deg, rgba(200,215,255,0.10), rgba(160,180,240,0.05))",
            backdropFilter: "blur(2px)",
            boxShadow: "inset 0 0 0 1.5px rgba(210,225,255,0.16)",
            borderRadius: half === 0 ? "18px 18px 0 0" : "0 0 18px 18px",
            translate: `0px ${(half === 0 ? -1 : 1) * slice * 480}px`,
            opacity: (1 - slice) * ease(frame, 0, 10),
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 200, width: 1520 * (1 - slice), top: 598, height: 4, background: K.gold, boxShadow: `0 0 20px ${K.gold}`, opacity: ease(frame, 4, 16) }} />
      <div style={{ position: "absolute", left: 940, top: 580, width: 40, height: 40, borderRadius: "50%", border: `3px solid ${K.gold}`, background: K.midnight, opacity: (1 - slice) * ease(frame, 8, 18) }} />
      {/* the slice of light */}
      <div style={{ position: "absolute", left: interpolate(frame, [72, 88], [-200, 2100], clamp), top: -100, width: 30, height: 1280, rotate: "20deg", background: "linear-gradient(90deg, transparent, #fff, transparent)", boxShadow: `0 0 60px ${K.cyan}`, opacity: frame >= 72 && frame <= 90 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 110 }}>
        <Headline {...L[0]} size={120} accent={["Premium"]} accentColor={K.gold} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 110 }}>
        <Headline {...L[1]} size={120} accent={["Local"]} accentColor={K.cyan} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 110 }}>
        <Headline {...L[2]} size={104} accent={["ambition"]} accentColor={K.gold} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 6. The lifeline: a network from the Hi mark ─────────────────────── */
const PLACES = [
  { label: "Your shop", a: 180, icon: "M6 14h20v12H6z M4 14l3-7h18l3 7 M13 26v-6h6v6" },
  { label: "Online store", a: 228, icon: "M5 7h3l3 13h13l3-9H10 M13 25a1.5 1.5 0 1 0 0.01 0 M22 25a1.5 1.5 0 1 0 0.01 0" },
  { label: "Your team", a: 300, icon: "M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M21 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 26c0-5 4-8 7-8s7 3 7 8 M16 26c0-5 3-8 5-8 3 0 7 3 7 8" },
  { label: "Customers", a: 0, icon: "M16 27s-10-6-10-13a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 7-10 13-10 13z" },
  { label: "Mobile", a: 60, icon: "M11 4h10v24H11z M15 24h2" },
  { label: "Search", a: 132, icon: "M14 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M20 20l7 7" },
];

export const Lifeline: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("lifeline");
  const cx = 960;
  const cy = 600;
  const converge = ease(frame, duration - 18, duration);
  const zoom = interpolate(frame, [0, duration], [1, 1.06]);
  const pos = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return [cx + Math.cos(rad) * 620 * (1 - converge), cy + Math.sin(rad) * 300 * (1 - converge)];
  };
  return (
    <AbsoluteFill>
      <Midnight glow={K.cobalt} glowX={50} glowY={55} glowSize={50 + ease(frame, 0, 120) * 30} glowAlpha={0.22 + ease(frame, 0, 140) * 0.18}>
        <Dust n={40} seed="life" colors={[K.gold, K.cyan, "#fff"]} opacity={0.5} />
      </Midnight>
      <AbsoluteFill style={{ scale: String(zoom) }}>
        {/* radial waves */}
        {[0, 1, 2, 3].map((i) => {
          const t = ((frame - i * 18) % 72) / 72;
          return frame >= i * 18 ? <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 200 + t * 1500, height: 100 + t * 750, translate: "-50% -50%", borderRadius: "50%", border: `2px solid ${i % 2 ? K.cyan : K.gold}`, opacity: (1 - t) * 0.35 * (1 - converge) }} /> : null;
        })}
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {PLACES.map((p, i) => {
            const [x, y] = pos(p.a);
            const t = ease(frame, 14 + i * 9, 34 + i * 9);
            return <line key={i} x1={cx} y1={cy} x2={cx + (x - cx) * t} y2={cy + (y - cy) * t} stroke={i % 2 ? K.cyan : K.gold} strokeWidth={3} opacity={0.7} style={{ filter: `drop-shadow(0 0 8px ${i % 2 ? K.cyan : K.gold})` }} />;
          })}
          {/* the mesh between neighbours */}
          {PLACES.map((p, i) => {
            const [x1, y1] = pos(p.a);
            const [x2, y2] = pos(PLACES[(i + 1) % PLACES.length].a);
            const t = ease(frame, 90 + i * 6, 112 + i * 6);
            return <line key={`m${i}`} x1={x1} y1={y1} x2={x1 + (x2 - x1) * t} y2={y1 + (y2 - y1) * t} stroke="#fff" strokeWidth={1.5} opacity={0.3} />;
          })}
          {/* particles flowing out along the links */}
          {PLACES.map((p, i) => {
            const [x, y] = pos(p.a);
            if (frame < 34 + i * 9) return null;
            return [0, 1, 2].map((k) => {
              const q = ((frame * 0.025 + k / 3 + i * 0.11) % 1);
              return <circle key={`${i}${k}`} cx={cx + (x - cx) * q} cy={cy + (y - cy) * q} r={4} fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${K.cyan})` }} />;
            });
          })}
        </svg>
        {PLACES.map((p, i) => {
          const [x, y] = pos(p.a);
          const on = ease(frame, 30 + i * 9, 40 + i * 9);
          const first = i === 0;
          return (
            <div key={p.label} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: first ? 1 : on }}>
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: on > 0.5 ? `linear-gradient(135deg, ${K.cobalt}, ${K.violet})` : "rgba(30,36,60,0.9)",
                  boxShadow: on > 0.5 ? `0 0 0 2px ${K.cyan}, 0 0 40px ${K.cyan}88` : "0 0 0 2px rgba(160,176,214,0.3)",
                  scale: String(1 + (on > 0.5 ? 0.06 * Math.sin(frame / 10 + i) : 0)),
                }}
              >
                <svg viewBox="0 0 32 32" width={50} height={50} fill="none" stroke={on > 0.5 ? "#fff" : K.mist} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.icon} />
                </svg>
              </div>
              <div style={{ fontFamily: BODY, fontWeight: 650, fontSize: 22, color: on > 0.5 ? K.white : K.mist }}>{p.label}</div>
            </div>
          );
        })}
        {/* the Hi mark at the centre */}
        <div style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%", filter: `drop-shadow(0 0 ${30 + 20 * Math.sin(frame / 12)}px rgba(255,200,61,0.6))`, scale: String(1 + converge * 0.4) }}>
          <HiMarkAnimated size={170} frame={200} final />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, right: 120, top: 90 }}>
        <Headline {...L[0]} size={96} accent={["more"]} accentColor={K.gold} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 90 }}>
        <Headline {...L[1]} size={96} accent={["brand"]} accentColor={K.gold} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 90 }}>
        <Headline {...L[2]} size={96} accent={["next"]} accentColor={K.cyan} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [duration - 4, duration], [0, 0.25], clamp) }} />
    </AbsoluteFill>
  );
};

/* ── 7. The brand statement ──────────────────────────────────────────── */
export const Final: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 16) => ({ opacity: ease(frame, at, at + d), translate: `0px ${(1 - ease(frame, at, at + d)) * 26}px`, filter: `blur(${(1 - ease(frame, at, at + d)) * 8}px)` });
  const sweep = interpolate(frame, [14, 44], [-20, 120], clamp);
  return (
    <AbsoluteFill>
      <Midnight glow={K.cobalt} glowX={50} glowY={38} glowSize={55} glowAlpha={0.3}>
        <AbsoluteFill style={{ background: `radial-gradient(45% 30% at 50% 92%, ${K.gold}22, transparent 70%)` }} />
        <Dust n={22} seed="final" colors={[K.gold, "#fff"]} size={3} opacity={0.35} />
      </Midnight>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", scale: String(interpolate(frame, [0, duration], [1, 1.02])) }}>
        <div style={{ position: "relative", ...enter(4, 22), scale: String(interpolate(ease(frame, 4, 30), [0, 1], [0.94, 1])) }}>
          <Img src={staticFile("brand/logo-reverse.svg")} style={{ width: 760, display: "block", filter: "drop-shadow(0 0 40px rgba(255,200,61,0.25))" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent ${sweep - 10}%, rgba(255,255,255,0.55) ${sweep}%, transparent ${sweep + 10}%)`,
              WebkitMaskImage: `url(${staticFile("brand/logo-reverse.svg")})`,
              WebkitMaskSize: "100% 100%",
              maskImage: `url(${staticFile("brand/logo-reverse.svg")})`,
              maskSize: "100% 100%",
              opacity: frame < 46 ? 1 : 0,
            }}
          />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 780, fontSize: 84, letterSpacing: "-0.035em", color: K.white, marginTop: 64, ...enter(26) }}>
          Premium services. <span style={{ color: K.gold }}>Local prices.</span>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 40, color: K.mist, marginTop: 18, ...enter(40) }}>Engineers, not an agency.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 52, ...enter(54) }}>
          <div style={{ padding: "18px 40px", borderRadius: 999, background: K.gold, color: K.ink, fontFamily: BODY, fontWeight: 800, fontSize: 34, boxShadow: `0 0 40px ${K.gold}55` }}>Build with HiBrands</div>
          <div style={{ fontFamily: BODY, fontWeight: 650, fontSize: 34, color: K.white }}>hibrands.in</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Label };
