import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { BODY, DISPLAY, EASE, clamp, useLayout } from "../theme";
import timeline from "./timeline.json";

/* Brand tokens for the intro film. Colours come from the website; midnight and the
   light accents are the film's cinematic layer. */
export const K = {
  midnight: "#0A0E22",
  midnight2: "#18213D",
  ink: "#0E1430",
  white: "#F5F7FF",
  mist: "#9AA6C8",
  cobalt: "#3050F0",
  electric: "#4D7BFF",
  violet: "#7B5CFF",
  cyan: "#1EC8F0",
  gold: "#FFC83D",
  coral: "#C6EEDB",
  mint: "#C6EEDB",
};

export const TL4 = timeline;
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: EASE });

/* Deep midnight background with a coloured light pool and film grain */
export const Midnight: React.FC<{ glow?: string; glowX?: number; glowY?: number; glowSize?: number; glowAlpha?: number; children?: React.ReactNode; grain?: boolean }> = ({
  glow = K.cobalt,
  glowX = 50,
  glowY = 45,
  glowSize = 60,
  glowAlpha = 0.25,
  children,
  grain = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, ${K.midnight2} 0%, ${K.midnight} 70%)`, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(${glowSize}% ${glowSize}% at ${glowX}% ${glowY}%, ${glow}${Math.round(glowAlpha * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />
      {children}
      {grain ? (
        <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
          <svg width="100%" height="100%">
            <filter id={`g${frame % 4}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 4} />
            </filter>
            <rect width="100%" height="100%" filter={`url(#g${frame % 4})`} />
          </svg>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/* Editorial headline: words rise out of a mask with a short blur, then leave */
export const Headline: React.FC<{
  text: string;
  from: number;
  to: number;
  size: number;
  color?: string;
  align?: "left" | "center";
  accent?: string[];
  accentColor?: string;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({ text, from, to, size, color = K.white, align = "center", accent = [], accentColor = K.gold, maxWidth, style }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 10) return null;
  const words = text.split(" ");
  const out = interpolate(frame, [to - 8, to + 2], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontWeight: 780,
        fontSize: size,
        letterSpacing: "-0.03em",
        lineHeight: 1.06,
        color,
        textAlign: align,
        maxWidth,
        textWrap: "balance",
        opacity: 1 - out,
        filter: `blur(${out * 12}px)`,
        translate: `0px ${-out * 20}px`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t = ease(frame, from + i * 2, from + i * 2 + 10);
        const clean = w.replace(/[.,]/g, "");
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span
              style={{
                display: "inline-block",
                translate: `0px ${(1 - t) * 105}%`,
                filter: `blur(${(1 - t) * 8}px)`,
                color: accent.includes(clean) ? accentColor : undefined,
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* Lines for a scene from the shared timeline */
export const linesFor = (scene: string) => timeline.lines.filter((l) => l.scene === scene);

/* A thin line of light */
export const LightLine: React.FC<{ x: number; y: number; w: number; color?: string; thick?: number; vertical?: boolean; opacity?: number }> = ({
  x,
  y,
  w,
  color = K.cyan,
  thick = 2,
  vertical,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: vertical ? x - thick / 2 : x - w / 2,
      top: vertical ? y - w / 2 : y - thick / 2,
      width: vertical ? thick : w,
      height: vertical ? w : thick,
      borderRadius: 99,
      background: `linear-gradient(${vertical ? 180 : 90}deg, transparent, ${color} 30%, #fff 50%, ${color} 70%, transparent)`,
      boxShadow: `0 0 ${thick * 8}px ${color}, 0 0 ${thick * 24}px ${color}`,
      opacity,
    }}
  />
);

/* Floating light particles (seeded, deterministic) */
export const Dust: React.FC<{ n?: number; seed?: string; colors?: string[]; size?: number; speed?: number; opacity?: number }> = ({
  n = 40,
  seed = "d",
  colors = [K.electric, K.cyan, K.violet],
  size = 4,
  speed = 0.6,
  opacity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { width, height, u } = useLayout();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`${seed}${i}${k}`);
        const s = (0.5 + r("s") * 1.3) * size * u;
        const y = (((r("y") * height - frame * (0.2 + r("v")) * speed * u) % height) + height) % height;
        const x = r("x") * width + Math.sin(frame / (30 + r("w") * 40) + i) * 14 * u;
        const c = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: c,
              boxShadow: `0 0 ${s * 3}px ${c}`,
              opacity: opacity * (0.4 + 0.6 * Math.abs(Math.sin(frame / (12 + r("t") * 12) + i))),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; size: number; style?: React.CSSProperties }> = ({ children, color = K.mist, size, style }) => (
  <div style={{ fontFamily: BODY, fontWeight: 650, fontSize: size, letterSpacing: "0.14em", textTransform: "uppercase", color, ...style }}>{children}</div>
);
