import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HI_BUBBLE, HI_LETTERS, HI_VIEWBOX } from "./hiPaths";
import { BODY, C, DISPLAY, EASE, clamp } from "./theme";

/* The marigold "Hi" speech bubble */
export const HiMark: React.FC<{ size: number; style?: React.CSSProperties; letters?: string; bubble?: string }> = ({
  size,
  style,
  letters = C.cobalt,
  bubble = C.marigold,
}) => (
  <svg viewBox={HI_VIEWBOX} width={size} height={size * (88.14 / 86)} style={style}>
    <path d={HI_BUBBLE} fill={bubble} />
    <path d={HI_LETTERS} fill={letters} />
  </svg>
);

/* Fade + rise entrance starting at `at` (frames) */
export const useEnter = (at: number, distance = 40, dur = 18) => {
  const frame = useCurrentFrame();
  return {
    opacity: interpolate(frame, [at, at + dur * 0.7], [0, 1], clamp),
    translate: `0px ${interpolate(frame, [at, at + dur], [distance, 0], { ...clamp, easing: EASE })}px`,
  } as React.CSSProperties;
};

/* Springy pop-in for chips, nodes and icons */
export const usePop = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 160, mass: 0.6 } });
  return { scale: String(interpolate(s, [0, 1], [0.4, 1])), opacity: interpolate(frame, [at, at + 5], [0, 1], clamp) } as React.CSSProperties;
};

/* Slow camera push across the whole scene (so no frame ever sits frozen),
   plus a short exit in the last frames so every cut feels deliberate */
export const useExit = (duration: number, frames = 8) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, duration], [1, 1.025], clamp);
  const out = interpolate(frame, [duration - frames, duration], [1, 0.97], clamp);
  return {
    opacity: interpolate(frame, [duration - frames, duration], [1, 0], clamp),
    scale: String(push * out),
  } as React.CSSProperties;
};

export const Display: React.FC<{ size: number; children: React.ReactNode; style?: React.CSSProperties; color?: string }> = ({
  size,
  children,
  style,
  color = C.ink,
}) => (
  <div
    style={{
      fontFamily: DISPLAY,
      fontWeight: 760,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: "-0.035em",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{ size: number; children: React.ReactNode; style?: React.CSSProperties; color?: string }> = ({
  size,
  children,
  style,
  color = C.ink2,
}) => (
  <div style={{ fontFamily: BODY, fontSize: size, lineHeight: 1.4, color, ...style }}>{children}</div>
);

export const Chip: React.FC<{ u: number; icon: React.ReactNode; tone?: "mint" | "sun" | "cobalt" | "pink"; children: React.ReactNode; style?: React.CSSProperties }> = ({
  u,
  icon,
  tone = "mint",
  children,
  style,
}) => {
  const tones = {
    mint: [C.mint, C.mintInk],
    sun: [C.marigold, C.ink],
    cobalt: [C.cobaltSoft, C.cobaltDeep],
    pink: ["#FFD9E2", "#C2185B"],
  } as const;
  const [bg, fg] = tones[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14 * u,
        padding: `${12 * u}px ${26 * u}px ${12 * u}px ${12 * u}px`,
        borderRadius: 999,
        background: C.surface,
        boxShadow: `0 ${18 * u}px ${40 * u}px -${18 * u}px rgba(24,33,61,0.45), 0 0 0 ${1.5 * u}px rgba(24,33,61,0.05)`,
        fontFamily: BODY,
        fontWeight: 650,
        fontSize: 30 * u,
        color: C.ink,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 48 * u,
          height: 48 * u,
          borderRadius: "50%",
          background: bg,
          color: fg,
          fontWeight: 800,
          fontSize: 26 * u,
        }}
      >
        {icon}
      </span>
      {children}
    </div>
  );
};

export const Card: React.FC<{ u: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ u, children, style }) => (
  <div
    style={{
      background: C.surface,
      borderRadius: 28 * u,
      boxShadow: `0 ${40 * u}px ${80 * u}px -${36 * u}px rgba(34,56,196,0.4), 0 0 0 ${1.5 * u}px rgba(24,33,61,0.05)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/* A browser window showing an image, optionally scrolled */
export const BrowserFrame: React.FC<{
  u: number;
  width: number;
  height: number;
  src: string;
  url: string;
  scrollY?: number;
  style?: React.CSSProperties;
}> = ({ u, width, height, src, url, scrollY = 0, style }) => {
  const bar = 44 * u;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18 * u,
        overflow: "hidden",
        background: C.surface,
        boxShadow: `0 ${40 * u}px ${80 * u}px -${30 * u}px rgba(24,33,61,0.45), 0 0 0 ${1.5 * u}px rgba(24,33,61,0.06)`,
        ...style,
      }}
    >
      <div style={{ height: bar, display: "flex", alignItems: "center", gap: 8 * u, padding: `0 ${16 * u}px`, background: C.paper }}>
        {["#FF9C8A", C.marigold, "#7FD6A8"].map((c) => (
          <span key={c} style={{ width: 12 * u, height: 12 * u, borderRadius: "50%", background: c }} />
        ))}
        <span
          style={{
            marginLeft: 12 * u,
            flex: 1,
            height: 26 * u,
            borderRadius: 99,
            background: C.surface,
            fontFamily: BODY,
            fontSize: 15 * u,
            color: C.ink3,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14 * u,
          }}
        >
          {url}
        </span>
      </div>
      <div style={{ position: "relative", height: height - bar, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: "100%", display: "block", translate: `0px ${-scrollY}px` }} />
      </div>
    </div>
  );
};

/* A phone with an image screen, optionally scrolled */
export const PhoneFrame: React.FC<{
  u: number;
  width: number;
  src?: string;
  scrollY?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ u, width, src, scrollY = 0, children, style }) => {
  const height = width * 2.05;
  const bezel = 12 * u;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 52 * u,
        background: C.ink,
        padding: bezel,
        boxShadow: `0 ${50 * u}px ${90 * u}px -${36 * u}px rgba(24,33,61,0.55)`,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 42 * u, overflow: "hidden", background: C.surface }}>
        {src ? <Img src={staticFile(src)} style={{ width: "100%", display: "block", translate: `0px ${-scrollY}px` }} /> : children}
        <div
          style={{
            position: "absolute",
            top: 12 * u,
            left: "50%",
            translate: "-50% 0",
            width: width * 0.3,
            height: 30 * u,
            borderRadius: 99,
            background: C.ink,
          }}
        />
      </div>
    </div>
  );
};

/* Marker-pen strike that draws across a line of text */
export const Strike: React.FC<{ progress: number; u: number }> = ({ progress, u }) => (
  <span
    style={{
      position: "absolute",
      left: -6 * u,
      right: -6 * u,
      top: "52%",
      height: 10 * u,
      borderRadius: 99,
      background: C.marigoldDeep,
      transformOrigin: "left center",
      scale: `${progress} 1`,
      translate: "0 -50%",
    }}
  />
);

export const ease = EASE;
