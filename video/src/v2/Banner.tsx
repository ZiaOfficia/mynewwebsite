import React from "react";
import { AbsoluteFill } from "remotion";
import { BrowserFrame, Chip, HiMark, PhoneFrame } from "../components";
import { BODY, C, DISPLAY } from "../theme";
import { G, Particles } from "./kit";

/* YouTube channel banner, 2560×1440.
   Everything that must be read sits in the 1546×423 safe area in the middle
   (shown on every device). The wider desktop band (2560×423) and the full TV
   canvas only get decoration. */
const W = 2560;
const H = 1440;
const SAFE = { w: 1546, h: 423 };
const sx = (W - SAFE.w) / 2; // 507
const sy = (H - SAFE.h) / 2; // 508.5

export const Banner: React.FC = () => {
  const u = 1.25;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(120deg, ${C.cobaltDeep} 0%, ${C.cobalt} 45%, ${G.violet} 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(35% 45% at 50% 50%, rgba(30,200,240,0.35), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(25% 40% at 12% 50%, rgba(255,200,61,0.18), transparent 70%)` }} />
      <Particles n={90} seed="banner" colors={["#ffffff", G.cyan, "#FFD66B"]} size={5} opacity={0.6} />

      {/* Desktop/TV-only decoration, left and right of the safe area */}
      <div style={{ position: "absolute", left: 40, top: sy + 40, rotate: "-6deg", opacity: 0.95 }}>
        <BrowserFrame u={0.9} width={430} height={290} src="site/home-full.jpg" url="hibrands.in" />
      </div>
      <div style={{ position: "absolute", right: 40, top: sy + 150, rotate: "-4deg" }}>
        <BrowserFrame u={0.8} width={270} height={182} src="projects/dumuzi.jpg" url="dumuzi.in" />
      </div>
      <div style={{ position: "absolute", right: 290, top: sy + 22, rotate: "5deg" }}>
        <PhoneFrame u={0.8} width={182} src="site/home-phone-full.jpg" />
      </div>

      {/* Safe area: logo and message */}
      <div
        style={{
          position: "absolute",
          left: sx,
          top: sy,
          width: SAFE.w,
          height: SAFE.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: -90, background: "radial-gradient(circle, rgba(255,200,61,0.5), transparent 65%)" }} />
          <HiMark size={250} style={{ position: "relative", rotate: "-5deg", filter: "drop-shadow(0 24px 40px rgba(10,15,60,0.45))" }} />
        </div>
        <div style={{ color: "#fff" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 112, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: C.marigold }}>Hi</span>Brands
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: 68, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 14 }}>
            Engineers, <span style={{ color: C.marigold }}>not an agency.</span>
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 550, fontSize: 32, color: "rgba(255,255,255,0.86)", marginTop: 18 }}>
            Websites · Landing pages · SEO · Social media · Google Ads
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
            <Chip u={u * 0.85} tone="sun" icon="✓">Premium quality. Minimum price.</Chip>
            <Chip u={u * 0.85} tone="cobalt" icon="↗">hibrands.in</Chip>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
