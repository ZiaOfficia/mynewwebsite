import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, EASE, clamp, useLayout } from "../theme";

/* Extra colours for this film: the night look of the agency world,
   and the glow accents (cyan, violet) of ours. */
export const G = {
  night: "#0A0F1E",
  night2: "#151C33",
  nightCard: "#161D34",
  nightLine: "rgba(160,176,214,0.16)",
  fog: "#C9D0E0",
  fogDim: "#7D879E",
  cyan: "#1EC8F0",
  violet: "#7B5CFF",
};

/* The agency world: deep navy, faint grid, vignette */
export const NightBg: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const { u } = useLayout();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: G.night, overflow: "hidden", ...style }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 70% at ${62 + Math.sin(frame / 90) * 4}% 18%, #1C2547 0%, rgba(10,15,30,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${G.nightLine} 1px, transparent 1px), linear-gradient(90deg, ${G.nightLine} 1px, transparent 1px)`,
          backgroundSize: `${96 * u}px ${96 * u}px`,
          backgroundPosition: `0px ${-frame * 0.4 * u}px`,
          opacity: 0.35,
          maskImage: "radial-gradient(80% 70% at 50% 40%, black, transparent)",
        }}
      />
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/* Our world: the site's paper colour lit by drifting cobalt, cyan and violet light */
export const GlowBg: React.FC<{ children?: React.ReactNode; strength?: number; base?: string; style?: React.CSSProperties }> = ({
  children,
  strength = 1,
  base = C.paper,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blob = (x: number, y: number, size: number, color: string, alpha: number) => (
    <AbsoluteFill
      style={{
        background: `radial-gradient(${size}% ${size}% at ${x}% ${y}%, ${color}${Math.round(alpha * strength * 255)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 70%)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden", ...style }}>
      {blob(18 + Math.sin(t * 0.5) * 6, 20 + Math.cos(t * 0.4) * 6, 55, C.cobalt, 0.2)}
      {blob(84 + Math.cos(t * 0.45) * 5, 26 + Math.sin(t * 0.35) * 8, 50, G.cyan, 0.22)}
      {blob(66 + Math.sin(t * 0.3) * 7, 92 + Math.cos(t * 0.5) * 5, 60, G.violet, 0.18)}
      {children}
    </AbsoluteFill>
  );
};

/* Slow-drifting light particles */
export const Particles: React.FC<{ n?: number; seed?: string; colors?: string[]; size?: number; speed?: number; opacity?: number }> = ({
  n = 40,
  seed = "p",
  colors = [C.cobalt, G.cyan, G.violet],
  size = 7,
  speed = 1,
  opacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const { width, height, u } = useLayout();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const s = (0.4 + r("s") * 1.2) * size * u;
        const vy = (0.3 + r("v") * 0.9) * speed * u;
        const x = r("x") * width + Math.sin(frame / (40 + r("w") * 40) + i) * 20 * u;
        const y = (((r("y") * height - frame * vy) % height) + height) % height;
        const tw = 0.5 + 0.5 * Math.sin(frame / (10 + r("t") * 14) + i * 2);
        const color = colors[i % colors.length];
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
              background: color,
              boxShadow: `0 0 ${s * 2.5}px ${color}`,
              opacity: opacity * (0.35 + 0.65 * tw),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* Particles thrown outward from a point */
export const Burst: React.FC<{ at: number; x: number; y: number; n?: number; seed?: string; reach?: number; colors?: string[] }> = ({
  at,
  x,
  y,
  n = 70,
  seed = "b",
  reach = 1,
  colors = ["#ffffff", G.cyan, G.violet, C.cobalt],
}) => {
  const frame = useCurrentFrame();
  const { u, width } = useLayout();
  if (frame < at) return null;
  const t = interpolate(frame, [at, at + 40], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const a = r("a") * Math.PI * 2;
        const d = (0.15 + r("d") * 0.6) * width * reach * t;
        const s = (2 + r("s") * 8) * u;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d,
              top: y + Math.sin(a) * d,
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${s * 3}px ${color}`,
              opacity: interpolate(frame, [at, at + 6, at + 34, at + 48], [0, 1, 0.8, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* Small uppercase label */
export const Eyebrow: React.FC<{ u: number; color: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ u, color, children, style }) => (
  <div
    style={{
      fontFamily: "Geist",
      fontWeight: 700,
      fontSize: 26 * u,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/* Text filled with the cobalt → violet → cyan glow gradient */
export const glowText = (): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${C.cobalt} 0%, ${G.violet} 55%, ${G.cyan} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});
