import React from "react";
import { AbsoluteFill } from "remotion";
import { HiMark } from "../components";
import { BODY, C, DISPLAY, useLayout } from "../theme";
import { G, GlowBg, NightBg, Particles, glowText } from "./kit";

/* YouTube thumbnails, 1280×720. Big words, high contrast, and the
   bottom-right corner kept clear for YouTube's duration badge. */

const Pill: React.FC<{ u: number; children: React.ReactNode }> = ({ u, children }) => (
  <div
    style={{
      position: "relative",
      height: 92 * u,
      borderRadius: 999,
      background: G.nightCard,
      boxShadow: `inset 0 0 0 ${2 * u}px rgba(160,176,214,0.22)`,
      display: "flex",
      alignItems: "center",
      gap: 16 * u,
      paddingLeft: 28 * u,
      fontFamily: BODY,
      fontWeight: 700,
      fontSize: 40 * u,
      color: G.fog,
      width: 510 * u,
    }}
  >
    <span style={{ width: 20 * u, height: 20 * u, borderRadius: "50%", background: "#46507A" }} />
    {children}
    <span
      style={{
        position: "absolute",
        left: -10 * u,
        right: -10 * u,
        top: "50%",
        height: 7 * u,
        borderRadius: 99,
        background: C.marigold,
        translate: "0 -50%",
        rotate: "-3deg",
        boxShadow: `0 0 ${16 * u}px rgba(255,200,61,0.6)`,
      }}
    />
  </div>
);

/* A: split screen. Agency layers crossed out on the left, the promise on the right */
export const ThumbnailA: React.FC = () => {
  const { u } = useLayout();
  const split = 690 * u;
  return (
    <AbsoluteFill>
      <GlowBg strength={1.7}>
        <Particles n={30} seed="thumbA" size={7} opacity={0.6} />
      </GlowBg>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: split, overflow: "hidden" }}>
        <NightBg>
          <div style={{ position: "absolute", left: 90 * u, top: 250 * u }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 92 * u, letterSpacing: "-0.03em", color: G.fogDim, lineHeight: 1 }}>
              AGENCY
            </div>
            <div style={{ display: "grid", gap: 24 * u, marginTop: 48 * u }}>
              {["Sales team", "Account manager", "Project manager", "Big office"].map((t) => (
                <Pill key={t} u={u}>{t}</Pill>
              ))}
            </div>
          </div>
        </NightBg>
      </div>
      <div
        style={{
          position: "absolute",
          left: split - 3 * u,
          top: 0,
          bottom: 0,
          width: 6 * u,
          background: `linear-gradient(180deg, ${G.cyan}, #fff, ${G.violet})`,
          boxShadow: `0 0 ${40 * u}px ${G.cyan}, 0 0 ${90 * u}px ${G.violet}`,
        }}
      />
      <div style={{ position: "absolute", left: split + 90 * u, top: 232 * u, right: 70 * u }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u }}>
          <HiMark size={110 * u} style={{ filter: `drop-shadow(0 0 ${30 * u}px rgba(255,200,61,0.6))` }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 84 * u, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1 }}>
            <span style={{ color: C.cobalt }}>Hi</span>Brands
          </div>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 178 * u, letterSpacing: "-0.045em", lineHeight: 0.92, marginTop: 50 * u, color: C.ink }}>
          Talk to the
          <br />
          <span style={{ ...glowText(), filter: `drop-shadow(0 ${6 * u}px ${24 * u}px rgba(123,92,255,0.35))` }}>Engineers.</span>
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 48 * u,
            padding: `${18 * u}px ${34 * u}px`,
            borderRadius: 999,
            background: C.marigold,
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 44 * u,
            color: C.ink,
            boxShadow: `0 ${18 * u}px ${40 * u}px -${14 * u}px rgba(214,150,0,0.6)`,
          }}
        >
          Premium quality. Minimum price.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* B: one bold statement, logo-led */
export const ThumbnailB: React.FC = () => {
  const { u } = useLayout();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.cobaltDeep} 0%, ${C.cobalt} 45%, ${G.violet} 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 70% at 78% 40%, rgba(30,200,240,0.45), transparent 70%)` }} />
      <Particles n={46} seed="thumbB" colors={["#ffffff", G.cyan, "#FFD66B"]} size={7} opacity={0.7} />
      <div style={{ position: "absolute", left: 110 * u, top: 258 * u, right: 560 * u }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 196 * u, letterSpacing: "-0.05em", lineHeight: 0.9, color: "#fff" }}>
          NOT AN
          <br />
          <span style={{ color: C.marigold }}>AGENCY.</span>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: 82 * u, letterSpacing: "-0.03em", lineHeight: 1.02, color: "#fff", marginTop: 44 * u }}>
          Just engineers.
          <br />
          <span style={{ color: "rgba(255,255,255,0.78)" }}>Minimum price.</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 110 * u, top: 260 * u, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 760 * u,
            height: 760 * u,
            translate: "-50% -55%",
            background: "radial-gradient(circle, rgba(255,200,61,0.55) 0%, rgba(255,200,61,0) 60%)",
          }}
        />
        <HiMark size={430 * u} style={{ position: "relative", rotate: "-6deg", filter: `drop-shadow(0 ${30 * u}px ${50 * u}px rgba(10,15,60,0.45))` }} />
        <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: 92 * u, letterSpacing: "-0.05em", color: "#fff", marginTop: 26 * u }}>
          <span style={{ color: C.marigold }}>Hi</span>Brands
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Shorts cover, 1080×1920. Agency layers crossed out on top, the promise below.
   The bottom fifth stays quiet because YouTube lays the title over it. */
export const ThumbnailShort: React.FC = () => {
  const u = 1;
  const split = 720;
  return (
    <AbsoluteFill>
      <GlowBg strength={1.8}>
        <Particles n={40} seed="thumbS" size={7} opacity={0.6} />
      </GlowBg>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: split, overflow: "hidden" }}>
        <NightBg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, letterSpacing: "-0.03em", color: G.fogDim, lineHeight: 1 }}>OTHER AGENCY</div>
            <div style={{ display: "grid", gap: 18, marginTop: 34 }}>
              {["Sales team", "Account manager", "Project manager", "Big office"].map((t) => (
                <Pill key={t} u={u * 0.92}>{t}</Pill>
              ))}
            </div>
          </div>
        </NightBg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: split - 4,
          height: 8,
          background: `linear-gradient(90deg, ${G.cyan}, #fff, ${G.violet})`,
          boxShadow: `0 0 40px ${G.cyan}, 0 0 90px ${G.violet}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 85,
          top: split - 85,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: C.marigold,
          display: "grid",
          placeItems: "center",
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: "-0.04em",
          color: C.ink,
          boxShadow: "0 0 0 10px #fff, 0 0 60px rgba(255,200,61,0.8), 0 20px 50px rgba(10,15,60,0.4)",
          zIndex: 2,
        }}
      >
        VS
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: split + 150, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <HiMark size={120} style={{ filter: "drop-shadow(0 0 30px rgba(255,200,61,0.6))" }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1 }}>
            <span style={{ color: C.cobalt }}>Hi</span>Brands
          </div>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 168, letterSpacing: "-0.045em", lineHeight: 0.92, marginTop: 56, color: C.ink }}>
          Talk to the
          <br />
          <span style={{ ...glowText(), filter: "drop-shadow(0 6px 24px rgba(123,92,255,0.35))" }}>Engineers.</span>
        </div>
        <div
          style={{
            marginTop: 56,
            padding: "22px 40px",
            borderRadius: 999,
            background: C.marigold,
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 46,
            color: C.ink,
            boxShadow: "0 18px 40px -14px rgba(214,150,0,0.6)",
          }}
        >
          Premium quality. Minimum price.
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 38, color: C.ink2, marginTop: 34 }}>
          Websites · SEO · Social media · Google Ads
        </div>
      </div>
    </AbsoluteFill>
  );
};
