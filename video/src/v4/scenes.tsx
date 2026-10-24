import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { HI_BUBBLE, HI_LETTERS, HI_VIEWBOX } from "../hiPaths";
import { BODY, DISPLAY, clamp } from "../theme";
import { Dust, Headline, K, LightLine, Midnight, ease, linesFor } from "./fx";

/* Rules from the review passes:
   - emphasised words are always marigold; cyan, blue and violet are light only
   - the logo is only ever outline, the official white variant, or the official colours
   - story scenes (1, 4): headline left at x=140; statement scenes: centred
   - everything readable sits inside the 90% title-safe area (x 96–1824, y 54–1026) */

type P = { duration: number };
const sp = (frame: number, at: number, damping = 14, stiffness = 140) => spring({ frame: frame - at, fps: 30, config: { damping, stiffness } });

/* ── The world of scenes 1 and 2: a storefront and its data, behind glass ── */
const NODES = [
  [200, 640], [250, 800], [560, 815], [780, 790], [930, 700], [1700, 300], [1770, 560], [1610, 720], [1320, 230], [1010, 810],
] as const;
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [3, 9], [5, 6], [6, 7], [8, 5], [4, 9]] as const;
const PANES = [880, 1150, 1420];
const PANE_TOP = 230;
const PANE_W = 250;
const PANE_H = 540;

/* Triangular shards fanned from a point inside each pane */
const shardsFor = (p: number) => {
  const cx = PANES[p] + PANE_W * (0.3 + random(`c${p}`) * 0.4);
  const cy = PANE_TOP + PANE_H * (0.3 + random(`d${p}`) * 0.4);
  const per: [number, number][] = [];
  const x0 = PANES[p];
  const x1 = x0 + PANE_W;
  const y0 = PANE_TOP;
  const y1 = PANE_TOP + PANE_H;
  [0, 0.35, 0.7].forEach((t) => per.push([x0 + PANE_W * t, y0]));
  [0, 0.3, 0.65].forEach((t) => per.push([x1, y0 + PANE_H * t]));
  [1, 0.6, 0.25].forEach((t) => per.push([x0 + PANE_W * t, y1]));
  [1, 0.55].forEach((t) => per.push([x0, y0 + PANE_H * t]));
  return per.map((a, i) => ({ c: [cx, cy] as [number, number], a, b: per[(i + 1) % per.length] }));
};

const World: React.FC<{ lit: number; beamX: number; offset?: number; breaks?: number[] }> = ({ lit, beamX, offset = 0, breaks = [0, 0, 0] }) => {
  const frame = useCurrentFrame() + offset;
  const draw = ease(frame, 18, 60);
  const stroke = lit > 0 ? `rgba(${Math.round(160 - 130 * lit)},${Math.round(176 + 24 * lit)},${Math.round(214 + 26 * lit)},${0.4 + 0.5 * lit})` : "rgba(160,176,214,0.4)";
  return (
    <>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {LINKS.map(([a, b], i) => {
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          const flick = 0.25 + 0.35 * Math.abs(Math.sin(frame / (6 + i) + i));
          const join = ease(frame, 40 + i * 4, 60 + i * 4) * lit;
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(160,176,214,0.5)" strokeWidth={2} strokeDasharray={`${len * 0.28} ${len * 0.44}`} opacity={flick * (1 - join) * draw} />
              <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * join} y2={y1 + (y2 - y1) * join} stroke={K.cyan} strokeWidth={3} opacity={join} style={{ filter: `drop-shadow(0 0 6px ${K.cyan})` }} />
            </g>
          );
        })}
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7 + lit * 3} fill={lit > 0.5 ? K.cyan : "rgba(160,176,214,0.6)"} opacity={(0.5 + 0.5 * lit) * draw} style={{ filter: lit > 0.3 ? `drop-shadow(0 0 10px ${K.cyan})` : "none" }} />
        ))}
        {/* storefront line art: awning, sign, window and a closed door */}
        <g fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" style={{ filter: lit > 0.2 ? `drop-shadow(0 0 ${8 * lit}px ${K.cyan})` : "none" }}>
          {[
            "M1040,760 L1040,430 L1640,430 L1640,760",
            "M1010,430 L1670,430 L1640,360 L1040,360 Z",
            "M1040,430 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0 q37,40 75,0",
            "M1100,500 L1300,500 L1300,680 L1100,680 Z",
            "M1380,760 L1380,500 L1560,500 L1560,760",
            "M1530,640 L1530,660",
            "M1120,290 L1560,290 L1560,345 L1120,345 Z",
          ].map((d, i) => (
            <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          ))}
        </g>
        {/* dashboard, below the headline column */}
        <g>
          <rect x={250} y={500} width={400} height={250} rx={14} fill={lit > 0 ? `rgba(48,80,240,${0.14 * lit})` : "none"} stroke={stroke} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const hh = lit > 0 ? 40 + i * 22 * ease(frame, 50 + i * 4, 70 + i * 4) : 20 + random(`b${i}`) * 40;
            return <rect key={i} x={288 + i * 58} y={720 - hh} width={34} height={hh} rx={4} fill={lit > 0.4 ? (i === 5 ? K.gold : K.mint) : "rgba(160,176,214,0.25)"} opacity={draw} />;
          })}
        </g>
        <line x1={0} y1={760} x2={1920} y2={760} stroke="rgba(160,176,214,0.18)" strokeWidth={2} opacity={draw} />
        {/* glass panes: whole, then broken where the beam crosses them */}
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(200,215,255,0.16)" />
            <stop offset="1" stopColor="rgba(160,180,240,0.04)" />
          </linearGradient>
        </defs>
        {PANES.map((x, p) => {
          const appear = ease(frame, 26 + p * 6, 50 + p * 6);
          const breakT = breaks[p];
          if (breakT <= 0) {
            return (
              <g key={p} opacity={appear} transform={`translate(0 ${(1 - appear) * 80})`}>
                <rect x={x} y={PANE_TOP} width={PANE_W} height={PANE_H} rx={6} fill="url(#glass)" stroke="rgba(210,225,255,0.28)" strokeWidth={1.5} />
                <path d={`M${x + 40},${PANE_TOP + 20} L${x + 70},${PANE_TOP + 20} L${x + 20},${PANE_TOP + 200} L${x - 10},${PANE_TOP + 200} Z`} fill="rgba(255,255,255,0.08)" />
              </g>
            );
          }
          return (
            <g key={p}>
              {shardsFor(p).map((sh, k) => {
                const r = (s: string) => random(`sh${p}${k}${s}`);
                const mx = (sh.c[0] + sh.a[0] + sh.b[0]) / 3;
                const my = (sh.c[1] + sh.a[1] + sh.b[1]) / 3;
                const vx = (mx - sh.c[0]) * (2 + r("v") * 3) + 200 * (r("x") - 0.2);
                const vy = (my - sh.c[1]) * (2 + r("w") * 3);
                const t = Math.max(0, breakT - r("d") * 0.12);
                const dx = vx * t * 1.3;
                const dy = vy * t * 1.3 + 420 * t * t;
                const rot = (r("r") - 0.5) * 140 * t;
                return (
                  <polygon
                    key={k}
                    points={`${sh.c[0]},${sh.c[1]} ${sh.a[0]},${sh.a[1]} ${sh.b[0]},${sh.b[1]}`}
                    fill="rgba(235,242,255,0.14)"
                    stroke="rgba(245,250,255,0.95)"
                    strokeWidth={2}
                    transform={`translate(${dx} ${dy}) rotate(${rot} ${mx} ${my})`}
                    opacity={Math.max(0, 1 - t * t * 1.05)}
                    style={{ filter: `drop-shadow(0 0 4px rgba(150,220,255,${0.6 * (1 - t)}))` }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </>
  );
};

/* ── 1. The struggle ─────────────────────────────────────────────────── */
export const Struggle: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("struggle");
  const grow = ease(frame, 2, 20);
  const drop = ease(frame, 20, 44);
  return (
    <AbsoluteFill style={{ background: K.midnight }}>
      <AbsoluteFill style={{ opacity: ease(frame, 12, 36), filter: "saturate(0.6)" }}>
        <Midnight glow="#3A4A7A" glowX={72} glowY={50} glowAlpha={0.22}>
          <AbsoluteFill style={{ scale: String(interpolate(frame, [0, duration], [1, 1.04])) }}>
            <World lit={0} beamX={-9999} />
          </AbsoluteFill>
        </Midnight>
      </AbsoluteFill>
      <LightLine x={960} y={540 + drop * 220} w={1500 * grow} color={K.electric} thick={2 + (1 - drop) * 2} opacity={1 - drop * 0.75} />
      <div style={{ position: "absolute", left: 140, top: 150, width: 760, textShadow: "0 0 40px rgba(10,14,34,0.9)" }}>
        <Headline {...L[0]} size={120} align="left" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 150, width: 760, textShadow: "0 0 40px rgba(10,14,34,0.9)" }}>
        <Headline {...L[1]} size={120} align="left" color="#C9D1F0" />
      </div>
    </AbsoluteFill>
  );
};

/* ── 2. The world changes ────────────────────────────────────────────── */
const beamAt = (f: number) => interpolate(f, [4, 26], [-300, 2200], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
const beamHit = (x: number) => {
  for (let f = 0; f < 40; f += 0.25) if (beamAt(f) >= x) return f;
  return 40;
};

export const Shift: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("shift");
  const beamX = beamAt(frame);
  const lit = ease(frame, 14, 44);
  const collapse = ease(frame, duration - 24, duration - 4);
  return (
    <AbsoluteFill style={{ background: K.midnight }}>
      <AbsoluteFill style={{ scale: String(interpolate(collapse, [0, 1], [1, 0.6]) * interpolate(frame, [0, duration], [1.04, 1.1])), opacity: 1 - collapse, filter: `saturate(${0.6 + 0.6 * lit})` }}>
        <Midnight glow={K.violet} glowX={60} glowY={50} glowSize={70} glowAlpha={0.12 + 0.3 * lit}>
          <AbsoluteFill style={{ background: `radial-gradient(60% 60% at 30% 60%, ${K.cobalt}55, transparent 70%)`, opacity: lit }} />
          <World lit={lit} beamX={beamX} offset={144} breaks={PANES.map((x) => { const hit = beamHit(x + PANE_W / 2); return interpolate(frame, [hit, hit + 15], [0, 1], clamp); })} />
          {/* interface tags assemble above the storefront */}
          {[
            { x: 1010, t: "Online orders", c: K.gold },
            { x: 1290, t: "Bookings", c: K.mint },
            { x: 1520, t: "Reviews", c: K.gold },
          ].map((c, i) => {
            const p = sp(frame, 44 + i * 8, 13, 150);
            return (
              <div
                key={c.t}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: 180,
                  padding: "14px 22px",
                  borderRadius: 14,
                  background: "rgba(14,20,48,0.85)",
                  boxShadow: `0 0 0 1.5px ${K.cyan}88, 0 0 30px ${K.cyan}44`,
                  fontFamily: BODY,
                  fontWeight: 650,
                  fontSize: 26,
                  color: K.white,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  whiteSpace: "nowrap",
                  scale: String(interpolate(p, [0, 1], [0.5, 1])),
                  opacity: frame >= 44 + i * 8 ? 1 : 0,
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: c.c }} />
                {c.t}
              </div>
            );
          })}
          <Dust n={30} seed="shift" opacity={0.5 * lit} />
        </Midnight>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: beamX - 60, top: -100, width: 120, height: 1280, rotate: "12deg", background: `linear-gradient(90deg, transparent, ${K.cyan}66 35%, #fff 50%, ${K.cyan}66 65%, transparent)`, filter: "blur(6px)", opacity: interpolate(frame, [4, 8, 22, 28], [0, 1, 1, 0], clamp) }} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [12, 16, 26], [0, 0.3, 0], clamp) }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 868 }}>
        <Headline {...L[0]} size={100} accent={["out", "of", "reach"]} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 3. The HiBrands reveal ──────────────────────────────────────────────
   outline trace → official white variant (white bubble, ink "Hi") with blue
   and violet-to-cyan light passing over it → official marigold and cobalt. */
export const HiMarkAnimated: React.FC<{ size: number; frame: number; final?: boolean }> = ({ size, frame, final }) => {
  const trace = final ? 1 : ease(frame, 2, 34);
  const traceL = final ? 1 : ease(frame, 12, 40);
  const white = final ? 1 : ease(frame, 34, 44);
  const off = final ? 1 : ease(frame, 70, 74);
  const blueX = interpolate(frame, [44, 58], [-30, 120], clamp);
  const vioX = interpolate(frame, [56, 70], [-30, 120], clamp);
  const glint = interpolate(frame, [74, 86], [-20, 110], clamp);
  const id = `hm${size}`;
  return (
    <svg viewBox={HI_VIEWBOX} width={size} height={size * (88.14 / 86)} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={HI_BUBBLE} />
        </clipPath>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={K.electric} stopOpacity={0} />
          <stop offset="0.5" stopColor={K.electric} stopOpacity={0.75} />
          <stop offset="1" stopColor={K.electric} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={K.violet} stopOpacity={0} />
          <stop offset="0.35" stopColor={K.violet} stopOpacity={0.6} />
          <stop offset="0.65" stopColor={K.cyan} stopOpacity={0.6} />
          <stop offset="1" stopColor={K.cyan} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#FFF6D8" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={HI_BUBBLE} fill="#fff" opacity={white * (1 - off)} />
      <path d={HI_BUBBLE} fill={K.gold} opacity={off} />
      <path d={HI_LETTERS} fill={off > 0.5 ? K.cobalt : "#18213D"} opacity={white} />
      {!final ? (
        <g clipPath={`url(#${id}c)`} style={{ mixBlendMode: "screen" }}>
          <rect x={blueX - 18} y={-10} width={36} height={110} fill={`url(#${id}b)`} opacity={frame > 44 && frame < 60 ? 1 : 0} transform="rotate(18 43 44)" />
          <rect x={vioX - 22} y={-10} width={44} height={110} fill={`url(#${id}v)`} opacity={frame > 56 && frame < 72 ? 1 : 0} transform="rotate(18 43 44)" />
          <rect x={glint - 7} y={-10} width={14} height={110} fill={`url(#${id}g)`} opacity={frame > 74 && frame < 88 ? 1 : 0} transform="rotate(18 43 44)" />
        </g>
      ) : null}
      <path d={HI_BUBBLE} fill="none" stroke="#fff" strokeWidth={0.7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trace} opacity={1 - white * 0.9} style={{ filter: `drop-shadow(0 0 1.2px ${K.cyan})` }} />
      <path d={HI_LETTERS} fill="none" stroke="#fff" strokeWidth={0.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traceL} opacity={1 - white} />
    </svg>
  );
};

/* Official lockup geometry (logo-reverse.svg is 992.42 × 204.6; the bubble is ~200 wide) */
const LOCK_W = 820;
const LOCK_X = 960 - LOCK_W / 2;
const LOCK_Y = 360;
const LOCK_H = (LOCK_W * 204.6) / 992.42;
const BUBBLE = (LOCK_W * 199.6) / 992.42;

export const Reveal: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const L = linesFor("reveal");
  const hit = interpolate(frame, [72, 74, 100], [0, 1, 0], clamp);
  const move = ease(frame, 80, 98);
  const markSize = interpolate(move, [0, 1], [340, BUBBLE]);
  const cx = interpolate(move, [0, 1], [960, LOCK_X + BUBBLE / 2]);
  const cy = interpolate(move, [0, 1], [440, LOCK_Y + (BUBBLE * (88.14 / 86)) / 2]);
  const word = ease(frame, 90, 108);
  const lightGlow = frame < 58 ? K.electric : frame < 72 ? K.violet : K.gold;
  return (
    <AbsoluteFill style={{ background: K.midnight }}>
      <Midnight glow={lightGlow} glowX={50} glowY={40} glowSize={40} glowAlpha={0.1 + 0.25 * ease(frame, 30, 72)}>
        <Dust n={26} seed="reveal" size={3} opacity={0.35 * ease(frame, 72, 100)} colors={[K.gold, "#fff", K.cyan]} />
      </Midnight>
      {[0, 1, 2].map((i) => {
        const t = interpolate(frame, [72 + i * 5, 120 + i * 5], [0, 1], clamp);
        return <div key={i} style={{ position: "absolute", left: 960, top: 440, width: 300 + t * 900, height: 300 + t * 900, translate: "-50% -50%", borderRadius: "50%", border: `2px solid ${i === 1 ? K.cyan : K.gold}`, opacity: (1 - t) * 0.45 * (frame >= 72 + i * 5 ? 1 : 0) }} />;
      })}
      {/* the animated mark travels into the lockup position */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          translate: "-50% -50%",
          scale: String(1 + hit * 0.04),
          filter: `drop-shadow(0 0 ${(20 + hit * 60) * (1 - move * 0.7)}px ${frame >= 72 ? "rgba(255,200,61,0.5)" : frame >= 56 ? "rgba(123,92,255,0.55)" : "rgba(77,123,255,0.5)"})`,
          opacity: frame >= 100 ? 0 : 1,
        }}
      >
        <HiMarkAnimated size={markSize} frame={frame} />
      </div>
      {/* the official lockup takes over; its wordmark wipes in */}
      <div style={{ position: "absolute", left: LOCK_X, top: LOCK_Y, width: LOCK_W, height: LOCK_H, opacity: frame >= 90 ? 1 : 0, clipPath: frame >= 100 ? "none" : `inset(0 ${(1 - word) * 76}% 0 ${BUBBLE / LOCK_W * 100 * (frame < 100 ? 1 : 0)}%)` }}>
        <Img src={staticFile("brand/logo-reverse.svg")} style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 660 }}>
        {frame >= L[0].from - 1 && frame <= L[0].to + 10 ? (
          <Headline {...L[0]} text="Meet HiBrands." size={104} />
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 660 }}>
        <Headline {...L[1]} size={96} accent={["digital", "growth"]} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 4. Engineers who build: five glass panels in depth ──────────────── */
const Glass: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ width: 360, height: 250, borderRadius: 18, background: "#121A3E", boxShadow: `0 0 0 1.5px ${K.cyan}55, 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 50px ${K.electric}22`, overflow: "hidden", position: "relative" }}>
    <div style={{ height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid rgba(160,176,214,0.15)" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: K.gold }} />
      <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 19, color: K.white, letterSpacing: "0.02em" }}>{title}</span>
    </div>
    <div style={{ position: "relative", height: 210, padding: 16 }}>{children}</div>
  </div>
);

const Bar: React.FC<{ w: string; c?: string; h?: number; mt?: number }> = ({ w, c = "rgba(160,176,214,0.25)", h = 10, mt = 10 }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: c, marginTop: mt }} />;

const PanelContent: React.FC<{ kind: string }> = ({ kind }) => {
  const frame = useCurrentFrame();
  if (kind === "Websites")
    return (
      <div>
        <div style={{ height: 70, borderRadius: 10, background: K.cobalt, padding: 12 }}>
          <Bar w="60%" c="rgba(255,255,255,0.9)" h={12} mt={0} />
          <Bar w="40%" c="rgba(255,255,255,0.55)" h={8} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10 }}>
          {[K.gold, K.mint, "#DCE3FF"].map((c) => (
            <div key={c} style={{ height: 70, borderRadius: 8, background: "rgba(255,255,255,0.06)", padding: 6 }}>
              <div style={{ height: 34, borderRadius: 6, background: c }} />
              <Bar w="70%" h={6} mt={8} />
            </div>
          ))}
        </div>
      </div>
    );
  if (kind === "Landing pages")
    return (
      <div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: 24, color: K.white }}>Book a free visit</div>
        {[0, 1].map((k) => (
          <div key={k} style={{ height: 32, borderRadius: 8, border: `1.5px solid ${frame > 40 + k * 14 ? K.cyan : "rgba(160,176,214,0.3)"}`, marginTop: 10 }} />
        ))}
        <div style={{ height: 40, borderRadius: 99, background: frame > 80 ? K.mint : K.gold, marginTop: 12, display: "grid", placeItems: "center", fontFamily: BODY, fontWeight: 750, fontSize: 17, color: "#18213D" }}>
          {frame > 80 ? "Booked ✓" : "Book now"}
        </div>
      </div>
    );
  if (kind === "SEO") {
    const climb = ease(frame, 40, 70);
    return (
      <div>
        <div style={{ height: 32, borderRadius: 99, background: "rgba(255,255,255,0.08)", padding: "0 14px", display: "flex", alignItems: "center", fontFamily: BODY, fontSize: 16, color: K.mist }}>best bakery near me</div>
        <div style={{ position: "relative", height: 150, marginTop: 10 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "absolute", left: 0, right: 0, top: interpolate(climb, [0, 1], [k * 44, (k + 1) * 44]), height: 36, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: BODY, fontSize: 15, color: K.mist, width: 18 }}>{climb > 0.5 ? k + 2 : k + 1}</span>
              <Bar w="70%" mt={0} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(climb, [0, 1], [3 * 44, 0]), height: 38, borderRadius: 8, background: "rgba(255,200,61,0.16)", boxShadow: `inset 0 0 0 1.5px ${K.gold}`, display: "flex", alignItems: "center", gap: 10, padding: "0 8px", fontFamily: BODY, fontWeight: 700, fontSize: 16, color: K.white }}>
            <span style={{ color: K.gold }}>{climb > 0.5 ? 1 : 4}</span> yourbakery.in
          </div>
        </div>
      </div>
    );
  }
  if (kind === "Social media") {
    const likes = Math.round(interpolate(frame, [30, 100], [12, 486], clamp));
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 150, height: 150, borderRadius: 12, background: `linear-gradient(135deg, ${K.cobalt}, ${K.mint})` }} />
        <div style={{ flex: 1 }}>
          <Bar w="80%" mt={0} />
          <Bar w="60%" />
          <div style={{ marginTop: 18, fontFamily: BODY, fontWeight: 750, fontSize: 22, color: K.white }}>
            <span style={{ color: K.gold }}>♥</span> {likes}
          </div>
        </div>
      </div>
    );
  }
  const bars = [30, 42, 38, 55, 64, 80, 96];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 166 }}>
      {bars.map((b, k) => (
        <div key={k} style={{ flex: 1, height: `${b * ease(frame, 20 + k * 6, 34 + k * 6)}%`, borderRadius: "6px 6px 2px 2px", background: k === bars.length - 1 ? K.gold : K.mint }} />
      ))}
    </div>
  );
};

const SERVICES = ["Websites", "Landing pages", "SEO", "Social media", "Google Ads"];
const PANEL_SCALE = 0.88;
const SLOTS = [
  [800, 250], [1135, 220], [1470, 250], [960, 570], [1300, 590],
];
const pw = 360 * PANEL_SCALE;
const ph = 250 * PANEL_SCALE;

const ICONS: Record<string, React.ReactNode> = {
  Websites: <path d="M4 6h24v18H4z M4 11h24 M8 8.5h1 M11 8.5h1" />,
  "Landing pages": <path d="M7 4h18v24H7z M11 10h10 M11 15h10 M11 21h6" />,
  SEO: <path d="M14 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M20 20l7 7" />,
  "Social media": <path d="M6 7h20v14H13l-6 5v-5H6z M11 13h10 M11 17h6" />,
  "Google Ads": <path d="M5 26h22 M8 22v-6 M14 22V10 M20 22v-9 M26 22V6" />,
};


export const Engineers: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const L = linesFor("engineers");
  const recede = ease(frame, 120, 134);
  return (
    <AbsoluteFill>
      <Midnight glow={K.cobalt} glowX={68} glowY={48} glowSize={60} glowAlpha={0.3}>
        <AbsoluteFill style={{ background: `radial-gradient(40% 50% at 85% 80%, ${K.violet}33, transparent 70%)` }} />
        <Dust n={30} seed="eng" opacity={0.4} />
      </Midnight>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - recede }}>
        {[[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [1, 3], [1, 4]].map(([a, b], i) => {
          const ax = SLOTS[a][0] + pw / 2, ay = SLOTS[a][1] + ph / 2, bx = SLOTS[b][0] + pw / 2, by = SLOTS[b][1] + ph / 2;
          const t = ease(frame, 18 + i * 5, 40 + i * 5);
          const pulse = (frame * 0.02 + i * 0.17) % 1;
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={ax + (bx - ax) * t} y2={ay + (by - ay) * t} stroke={K.cyan} strokeWidth={2} opacity={0.4} />
              {t >= 1 ? <circle cx={ax + (bx - ax) * pulse} cy={ay + (by - ay) * pulse} r={4} fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${K.cyan})` }} /> : null}
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ perspective: 1800, opacity: 1 - recede, scale: String(1 - recede * 0.1), filter: `blur(${recede * 8}px)` }}>
        {SERVICES.map((s, i) => {
          const [x, y] = SLOTS[i];
          const p = sp(frame, 4 + i * 7, 15, 120);
          const drift = Math.sin(frame / 40 + i) * 8;
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: x,
                top: y + drift,
                transformOrigin: "0 0",
                transform: `scale(${PANEL_SCALE}) rotateY(${(i === 0 || i === 3 ? 12 : i === 2 || i === 4 ? -12 : 0) + Math.sin(frame / 60 + i) * 3}deg) rotateX(${i < 3 ? 5 : -5}deg) translateZ(${interpolate(p, [0, 1], [-500, 0])}px)`,
                opacity: interpolate(frame, [4 + i * 7, 12 + i * 7], [0, 1], clamp),
              }}
            >
              <Glass title={s}>
                <PanelContent kind={s} />
              </Glass>
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,14,34,0.94) 0%, rgba(10,14,34,0.6) 32%, transparent 44%)", opacity: 1 - recede }} />
      <div style={{ position: "absolute", left: 140, top: 390, width: 620 }}>
        <Headline {...L[0]} size={120} align="left" accent={["engineers"]} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 390, width: 620 }}>
        <Headline {...L[1]} size={104} align="left" accent={["real", "businesses"]} />
      </div>
      {/* the last beat: five services today, more on the way */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 250 }}>
        <Headline {...L[2]} size={92} accent={["Much", "more", "on", "the", "way"]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 30, opacity: recede }}>
        {SERVICES.map((s, i) => {
          const p = sp(frame, 130 + i * 3, 12, 160);
          return (
            <div key={s} style={{ width: 190, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, scale: String(interpolate(p, [0, 1], [0.5, 1])), opacity: frame >= 130 + i * 3 ? 1 : 0 }}>
              <div style={{ width: 150, height: 150, borderRadius: 36, display: "grid", placeItems: "center", background: K.cobalt, boxShadow: `0 0 0 2px ${K.cyan}66, 0 0 40px ${K.cyan}33` }}>
                <svg viewBox="0 0 32 32" width={74} height={74} fill="none" stroke={K.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[s]}
                </svg>
              </div>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36, color: K.white, textAlign: "center", lineHeight: 1.1 }}>{s}</div>
            </div>
          );
        })}
        <div style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: frame >= 146 ? 1 : 0 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {[0, 1].map((k) => (
              <div key={k} style={{ width: 140, height: 150, borderRadius: 36, border: `3px dashed ${K.gold}`, display: "grid", placeItems: "center", color: K.gold, fontFamily: DISPLAY, fontWeight: 800, fontSize: 64, opacity: 0.55 + 0.4 * Math.abs(Math.sin(frame / 8 + k)) }}>
                +
              </div>
            ))}
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36, color: K.gold, textAlign: "center", lineHeight: 1.1 }}>More coming</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 5. Premium services, local prices ───────────────────────────────── */
const GRID = [
  [450, 380], [800, 380], [1150, 380], [625, 650], [975, 650],
];

export const Premium: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("premium");
  const slice = ease(frame, 72, 90);
  const lock = ease(frame, 92, 136);
  const collapse = ease(frame, duration - 14, duration);
  return (
    <AbsoluteFill>
      <Midnight glow={frame < 72 ? "#5A4A2A" : K.cobalt} glowX={50} glowY={60} glowSize={70} glowAlpha={0.18 + 0.2 * slice}>
        <Dust n={24} seed="prem" colors={[K.gold, "#fff"]} opacity={0.35 * slice} />
      </Midnight>
      <AbsoluteFill style={{ scale: String(1 - collapse * 0.85), opacity: 1 - collapse * 0.9, transformOrigin: "960px 600px" }}>
        {/* gold joins sit in the gaps between panels, behind them */}
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lock }}>
          {[[0, 1], [1, 2], [3, 4], [0, 3], [1, 3], [1, 4], [2, 4]].map(([a, b], i) => (
            <line key={i} x1={GRID[a][0] + pw / 2} y1={GRID[a][1] + ph / 2} x2={GRID[b][0] + pw / 2} y2={GRID[b][1] + ph / 2} stroke={K.gold} strokeWidth={2.5} opacity={0.5} style={{ filter: `drop-shadow(0 0 6px ${K.gold})` }} />
          ))}
        </svg>
        {SERVICES.map((s, i) => {
          const r = (k: string) => random(`pr${i}${k}`);
          const sx = 240 + i * 300 + (r("x") - 0.5) * 80;
          const sy = 360 + (i % 2) * 220 + (r("y") - 0.5) * 80;
          const x = interpolate(lock, [0, 1], [sx, GRID[i][0]]);
          const y = interpolate(lock, [0, 1], [sy, GRID[i][1]]);
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transformOrigin: "0 0",
                transform: `scale(${PANEL_SCALE * (0.9 + 0.1 * slice)}) rotate(${(1 - lock) * (r("r") - 0.5) * 14}deg)`,
                filter: `blur(${(1 - slice) * 14}px) brightness(${0.55 + 0.45 * slice})`,
              }}
            >
              <Glass title={s}>
                <PanelContent kind={s} />
              </Glass>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* frosted glass held shut by a gold line; sliced open on "Local prices." */}
      {[0, 1].map((half) => (
        <div
          key={half}
          style={{
            position: "absolute",
            left: 200,
            width: 1520,
            top: half === 0 ? 300 : 600,
            height: 300,
            background: "linear-gradient(180deg, rgba(200,215,255,0.11), rgba(160,180,240,0.05))",
            boxShadow: `inset 0 0 0 1.5px rgba(210,225,255,${0.16 * (1 - slice)})`,
            borderRadius: half === 0 ? "18px 18px 0 0" : "0 0 18px 18px",
            translate: `0px ${(half === 0 ? -1 : 1) * slice * 480}px`,
            opacity: (1 - slice) * ease(frame, 0, 10),
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 200, width: 1520 * (1 - slice), top: 598, height: 4, background: K.gold, boxShadow: `0 0 20px ${K.gold}`, opacity: ease(frame, 4, 16) * (1 - slice) }} />
      <div style={{ position: "absolute", left: 940, top: 580, width: 40, height: 40, borderRadius: "50%", border: `3px solid ${K.gold}`, background: K.midnight, opacity: (1 - slice) * ease(frame, 8, 18) }} />
      <div style={{ position: "absolute", left: interpolate(frame, [72, 86], [-200, 2100], clamp), top: -100, width: 30, height: 1280, rotate: "20deg", background: "linear-gradient(90deg, transparent, #fff, transparent)", boxShadow: `0 0 60px ${K.cyan}`, opacity: frame >= 72 && frame <= 88 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 110 }}>
        <Headline {...L[0]} size={120} accent={["Premium"]} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 110 }}>
        <Headline {...L[1]} size={120} accent={["Local"]} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 110 }}>
        <Headline {...L[2]} size={104} accent={["ambition"]} />
      </div>
      {/* everything collapses to a point of light, where the Hi mark appears next */}
      <div style={{ position: "absolute", left: 960, top: 600, width: 30, height: 30, translate: "-50% -50%", borderRadius: "50%", background: "#fff", boxShadow: `0 0 60px 30px ${K.gold}`, opacity: interpolate(frame, [duration - 10, duration - 2, duration], [0, 1, 0.6], clamp) }} />
    </AbsoluteFill>
  );
};

/* ── 6. The lifeline: a network from the Hi mark ─────────────────────── */
const PLACES = [
  { label: "Your shop", a: 180, icon: "M6 14h20v12H6z M4 14l3-7h18l3 7 M13 26v-6h6v6", hero: true },
  { label: "Online store", a: 220, icon: "M5 7h3l3 13h13l3-9H10 M13 25a1.5 1.5 0 1 0 0.01 0 M22 25a1.5 1.5 0 1 0 0.01 0" },
  { label: "Your team", a: 320, icon: "M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M21 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 26c0-5 4-8 7-8s7 3 7 8 M16 26c0-5 3-8 5-8 3 0 7 3 7 8" },
  { label: "Customers", a: 0, icon: "M16 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M7 27c0-5 4-9 9-9s9 4 9 9 M22 9l2 2 4-4" },
  { label: "Mobile", a: 40, icon: "M11 4h10v24H11z M15 24h2" },
  { label: "Search", a: 140, icon: "M14 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M20 20l7 7" },
];

export const Lifeline: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const L = linesFor("lifeline");
  const cx = 960;
  const cy = 610;
  const converge = ease(frame, duration - 18, duration);
  const zoom = interpolate(frame, [0, duration], [1, 1.05]);
  const pos = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return [cx + Math.cos(rad) * 640 * (1 - converge), cy + Math.sin(rad) * 290 * (1 - converge)];
  };
  const born = ease(frame, 0, 14);
  return (
    <AbsoluteFill>
      <Midnight glow={K.cobalt} glowX={50} glowY={56} glowSize={50 + ease(frame, 0, 120) * 30} glowAlpha={0.22 + ease(frame, 0, 140) * 0.18}>
        <Dust n={40} seed="life" colors={[K.gold, K.cyan, "#fff"]} opacity={0.5} />
      </Midnight>
      <AbsoluteFill style={{ scale: String(zoom) }}>
        {[0, 1, 2, 3].map((i) => {
          const t = ((frame - i * 18) % 72) / 72;
          return frame >= i * 18 ? <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 200 + t * 1500, height: 100 + t * 750, translate: "-50% -50%", borderRadius: "50%", border: `2px solid ${i % 2 ? K.cyan : K.gold}`, opacity: (1 - t) * 0.3 * (1 - converge) }} /> : null;
        })}
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - ease(frame, duration - 30, duration - 20) }}>
          {PLACES.map((p, i) => {
            const [x, y] = pos(p.a);
            const t = ease(frame, 14 + i * 9, 32 + i * 9);
            return <line key={i} x1={cx} y1={cy} x2={cx + (x - cx) * t} y2={cy + (y - cy) * t} stroke={i === 0 ? K.gold : K.cyan} strokeWidth={i === 0 ? 4 : 3} opacity={0.75} style={{ filter: `drop-shadow(0 0 8px ${i === 0 ? K.gold : K.cyan})` }} />;
          })}
          {PLACES.map((p, i) => {
            const [x1, y1] = pos(p.a);
            const [x2, y2] = pos(PLACES[(i + 1) % PLACES.length].a);
            const t = ease(frame, 110 + i * 6, 130 + i * 6);
            return <line key={`m${i}`} x1={x1} y1={y1} x2={x1 + (x2 - x1) * t} y2={y1 + (y2 - y1) * t} stroke="#fff" strokeWidth={1.5} opacity={0.25 * (t > 0 ? 1 : 0)} />;
          })}
          {PLACES.map((p, i) => {
            const [x, y] = pos(p.a);
            if (frame < 34 + i * 9) return null;
            return [0, 1, 2].map((k) => {
              const q = (frame * 0.025 + k / 3 + i * 0.11) % 1;
              return <circle key={`${i}${k}`} cx={cx + (x - cx) * q} cy={cy + (y - cy) * q} r={4} fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${i === 0 ? K.gold : K.cyan})` }} />;
            });
          })}
        </svg>
        {PLACES.map((p, i) => {
          const [x, y] = pos(p.a);
          const on = ease(frame, 20 + i * 9, 30 + i * 9);
          const size = p.hero ? 132 : 108;
          return (
            <div key={p.label} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: (p.hero ? 1 : on) * (1 - ease(frame, duration - 30, duration - 22)), scale: String(1 - converge) }}>
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: on > 0.5 ? K.cobalt : "rgba(30,36,60,0.9)",
                  boxShadow: on > 0.5 ? `0 0 0 ${p.hero ? 4 : 2}px ${p.hero ? K.gold : K.cyan}, 0 0 40px ${p.hero ? K.gold : K.cyan}77` : "0 0 0 2px rgba(160,176,214,0.3)",
                }}
              >
                <svg viewBox="0 0 32 32" width={size * 0.5} height={size * 0.5} fill="none" stroke={on > 0.5 ? "#fff" : K.mist} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.icon} />
                </svg>
              </div>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: p.hero ? 34 : 30, color: on > 0.5 ? (p.hero ? K.gold : K.white) : K.mist, whiteSpace: "nowrap" }}>{p.label}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%", filter: `drop-shadow(0 0 ${30 + 20 * Math.sin(frame / 12)}px rgba(255,200,61,0.6))`, scale: String((0.3 + 0.7 * born) * (1 + converge * 0.4)) }}>
          <HiMarkAnimated size={170} frame={200} final />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, right: 120, top: 100 }}>
        <Headline {...L[0]} size={104} accent={["more"]} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 100 }}>
        <Headline {...L[1]} size={104} accent={["brand"]} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 100 }}>
        <Headline {...L[2]} size={104} accent={["next"]} />
      </div>
    </AbsoluteFill>
  );
};

/* ── 7. The brand statement ──────────────────────────────────────────── */
export const Final: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 14) => ({ opacity: ease(frame, at, at + d), translate: `0px ${(1 - ease(frame, at, at + d)) * 24}px`, filter: `blur(${(1 - ease(frame, at, at + d)) * 8}px)` });
  const sweep = interpolate(frame, [12, 34], [-20, 120], clamp);
  return (
    <AbsoluteFill>
      <Midnight glow={K.cobalt} glowX={50} glowY={42} glowSize={60} glowAlpha={0.32}>
        <Dust n={18} seed="final" colors={[K.gold, "#fff"]} size={3} opacity={0.3} />
      </Midnight>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", scale: String(interpolate(frame, [0, duration], [1, 1.015])) }}>
        <div style={{ position: "relative", ...enter(2, 18), scale: String(interpolate(ease(frame, 2, 24), [0, 1], [0.95, 1])) }}>
          <Img src={staticFile("brand/logo-reverse.svg")} style={{ width: 740, display: "block" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent ${sweep - 6}%, rgba(255,255,255,0.4) ${sweep}%, transparent ${sweep + 6}%)`,
              WebkitMaskImage: `url(${staticFile("brand/logo-reverse.svg")})`,
              WebkitMaskSize: "100% 100%",
              maskImage: `url(${staticFile("brand/logo-reverse.svg")})`,
              maskSize: "100% 100%",
              opacity: frame < 36 ? 1 : 0,
            }}
          />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 780, fontSize: 92, letterSpacing: "-0.03em", color: K.white, marginTop: 60, ...enter(14) }}>
          Premium services. <span style={{ color: K.gold }}>Local prices.</span>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 650, fontSize: 62, color: "#FFFFFF", marginTop: 14, ...enter(22) }}>Engineers, not an agency.</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 44, marginTop: 40, ...enter(30) }}>
          <span style={{ color: K.gold }}>Build with HiBrands</span>
          <span style={{ color: "rgba(245,247,255,0.55)" }}> · </span>
          <span style={{ color: K.white }}>hibrands.in</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
