import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Body, BrowserFrame, Chip, Display, HiMark, PhoneFrame, useEnter, useExit, usePop } from "../components";
import { BODY, C, DISPLAY, EASE, clamp, useLayout } from "../theme";
import { Eyebrow, G, GlowBg, NightBg, Particles, glowText } from "./kit";

type SceneProps = { duration: number };

/* A bar showing where a budget goes. Illustrative only: no figures shown. */
const BudgetBar: React.FC<{
  u: number;
  width: number;
  parts: { label: string; share: number; bg: string; fg: string }[];
  at: number;
  dark?: boolean;
}> = ({ u, width, parts, at, dark }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width }}>
      <Body size={24 * u} color={dark ? G.fogDim : C.ink3} style={{ fontWeight: 700, ...useEnter(at - 8, 16) }}>
        Where your budget goes
      </Body>
      <div style={{ display: "flex", gap: 4 * u, height: 58 * u, marginTop: 12 * u, borderRadius: 14 * u, overflow: "hidden" }}>
        {parts.map((p, i) => {
          const t = interpolate(frame, [at + i * 8, at + i * 8 + 16], [0, 1], { ...clamp, easing: EASE });
          return (
            <div
              key={p.label}
              style={{
                width: `${p.share * 100}%`,
                background: p.bg,
                color: p.fg,
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 19 * u,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                opacity: t,
                scale: `${t} 1`,
                transformOrigin: "left center",
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>
      <Body size={18 * u} color={dark ? "#5C6680" : C.ink3} style={{ marginTop: 10 * u, opacity: interpolate(frame, [at + 30, at + 40], [0, 0.9], clamp) }}>
        Illustration, not actual figures
      </Body>
    </div>
  );
};

/* ── 9. Side by side: same goal, two ways of getting there ─────────── */
export const COMPARE = { chain: (i: number) => 14 + i * 8, coin: (i: number) => 54 + i * 5, bars: 112, shift: 206, headline: 226, sub: 250, chip: 286 };

export const Compare: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v, width, height } = useLayout();
  const k = interpolate(frame, [COMPARE.shift, COMPARE.shift + 30], [0, 1], { ...clamp, easing: EASE });
  const splitA = v ? 0.44 : 0.46;
  const splitB = v ? 0.3 : 0.33;
  const split = splitA + (splitB - splitA) * k;
  const leftSize = (v ? height : width) * split;
  const shrink = split / splitA;
  const pillW = 330 * u;
  const coins = 9;

  return (
    <AbsoluteFill style={{ background: C.paper, ...useExit(duration) }}>
      {/* Bright side: ours */}
      <div style={{ position: "absolute", left: v ? 0 : leftSize, top: v ? leftSize : 0, right: 0, bottom: 0, overflow: "hidden" }}>
        <GlowBg strength={1.4}>
          <Particles n={30} seed="cmp" size={6} />
        </GlowBg>
      </div>
      {/* Phase A, ours: website, direct line, budget */}
      <div
        style={{
          position: "absolute",
          left: v ? 80 * u : leftSize + 110 * u,
          top: v ? leftSize + 70 * u : 130 * u,
          width: v ? 920 * u : width - leftSize - 220 * u,
          opacity: 1 - k,
          translate: `0px ${-60 * u * k}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, ...useEnter(4, 20) }}>
          <HiMark size={54 * u} />
          <Eyebrow u={u} color={C.cobalt}>HiBrands · engineers</Eyebrow>
        </div>
        <div style={{ marginTop: 26 * u, ...useEnter(10, 40, 22) }}>
          <BrowserFrame u={u} width={(v ? 640 : 600) * u} height={(v ? 400 : 370) * u} src="projects/dumuzi.jpg" url="dumuzi.in" style={{ boxShadow: `0 ${40 * u}px ${90 * u}px -${30 * u}px rgba(123,92,255,0.55), 0 0 ${60 * u}px rgba(30,200,240,0.25)` }} />
        </div>
        <div style={{ marginTop: 26 * u, ...usePop(40) }}>
          <Chip u={u} tone="cobalt" icon="↔">
            You and the engineer. Nothing in between.
          </Chip>
        </div>
        <div style={{ marginTop: 36 * u }}>
          <BudgetBar
            u={u}
            width={(v ? 920 : 640) * u}
            at={COMPARE.bars}
            parts={[
              { label: "The work", share: 0.86, bg: `linear-gradient(90deg, ${C.cobalt}, ${G.violet})`, fg: "#fff" },
              { label: "Costs", share: 0.14, bg: C.cobaltSoft, fg: C.cobaltDeep },
            ]}
          />
        </div>
      </div>
      {/* Phase B, ours: the message */}
      <div
        style={{
          position: "absolute",
          left: v ? 80 * u : width * splitB + 120 * u,
          top: v ? height * splitB : 0,
          right: (v ? 80 : 120) * u,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: frame >= COMPARE.headline - 2 ? 1 : 0,
        }}
      >
        <Display size={(v ? 150 : 158) * u} style={{ ...useEnter(COMPARE.headline, 50, 22) }}>
          <span style={glowText()}>Premium quality.</span>
          <br />
          Minimum price.
        </Display>
        <Body size={(v ? 44 : 42) * u} color={C.ink2} style={{ marginTop: 34 * u, maxWidth: 1000 * u, ...useEnter(COMPARE.sub, 24) }}>
          Pay for the expertise that builds your product, not for layers of overhead.
        </Body>
        <div style={{ marginTop: 40 * u, ...usePop(COMPARE.chip) }}>
          <Chip u={u} tone="sun" icon="Hi">
            Engineers, not an agency
          </Chip>
        </div>
      </div>

      {/* Dark side: the agency */}
      <div style={{ position: "absolute", left: 0, top: 0, width: v ? width : leftSize, height: v ? leftSize : height, overflow: "hidden" }}>
        <NightBg>
          <div
            style={{
              position: "absolute",
              left: (v ? 80 : 90) * u,
              top: (v ? 100 : 130) * u,
              transformOrigin: "top left",
              scale: String(shrink),
            }}
          >
            <Eyebrow u={u} color={G.fogDim} style={useEnter(4, 20)}>
              Traditional agency
            </Eyebrow>
            <div style={{ display: "flex", gap: 60 * u, marginTop: 30 * u, alignItems: "flex-end" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 28 * u, top: 29 * u, width: 2 * u, height: 4 * 76 * u, background: G.nightLine }} />
                {["You", "Sales", "Account manager", "Project manager", "Engineers"].map((n, i) => (
                  <div
                    key={n}
                    style={{
                      position: "relative",
                      width: pillW,
                      height: 58 * u,
                      marginTop: i ? 18 * u : 0,
                      borderRadius: 999,
                      background: i === 0 ? "#E9EDF7" : G.nightCard,
                      boxShadow: `inset 0 0 0 ${1.5 * u}px ${G.nightLine}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 14 * u,
                      paddingLeft: 20 * u,
                      fontFamily: BODY,
                      fontWeight: 650,
                      fontSize: 25 * u,
                      color: i === 0 ? G.night : G.fog,
                      ...useEnter(COMPARE.chain(i), -24, 14),
                    }}
                  >
                    <span style={{ width: 18 * u, height: 18 * u, borderRadius: "50%", background: i === 0 ? C.cobalt : "#3A4466" }} />
                    {n}
                  </div>
                ))}
              </div>
              {/* A generic tall stack of coins: costs pile up, no figures */}
              <div style={{ position: "relative", width: 170 * u, height: (coins - 1) * 26 * u + 50 * u }}>
                {Array.from({ length: coins }).map((_, i) => {
                  const at = COMPARE.coin(i);
                  const drop = interpolate(frame, [at, at + 10], [-160 * u, 0], { ...clamp, easing: EASE });
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: i * 26 * u,
                        width: 170 * u,
                        height: 50 * u,
                        borderRadius: "50%",
                        background: "linear-gradient(180deg, #8B7A4E 0%, #5E5236 100%)",
                        boxShadow: `inset 0 ${-8 * u}px 0 rgba(0,0,0,0.25), 0 0 0 ${1.5 * u}px rgba(214,196,150,0.25)`,
                        translate: `0px ${drop}px`,
                        opacity: interpolate(frame, [at, at + 4], [0, 1], clamp),
                        display: "grid",
                        placeItems: "center",
                        fontFamily: BODY,
                        fontWeight: 800,
                        fontSize: 26 * u,
                        color: "rgba(255,240,200,0.55)",
                      }}
                    >
                      {i === coins - 1 ? "₹" : ""}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: 48 * u }}>
              <BudgetBar
                u={u}
                dark
                width={(v ? 920 : 600) * u}
                at={COMPARE.bars}
                parts={[
                  { label: "Sales", share: 0.17, bg: "#2A3252", fg: G.fogDim },
                  { label: "Management", share: 0.23, bg: "#2A3252", fg: G.fogDim },
                  { label: "Office", share: 0.2, bg: "#2A3252", fg: G.fogDim },
                  { label: "The work", share: 0.4, bg: "#4A5A9C", fg: "#E9EDF7" },
                ]}
              />
            </div>
          </div>
        </NightBg>
      </div>
      {/* The glowing seam between the two worlds */}
      <div
        style={{
          position: "absolute",
          left: v ? 0 : leftSize - 2 * u,
          top: v ? leftSize - 2 * u : 0,
          width: v ? width : 4 * u,
          height: v ? 4 * u : height,
          background: `linear-gradient(${v ? 90 : 180}deg, ${G.cyan}, #fff, ${G.violet})`,
          boxShadow: `0 0 ${30 * u}px ${G.cyan}, 0 0 ${70 * u}px ${G.violet}`,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

/* ── 10. Why we can offer better value: the two workflows ──────────── */
const AGENCY_FLOW = ["Client", "Account management", "Agency overhead", "Engineering team"];
export const WHY = { stops: [26, 48, 70, 92], ours: [100, 114], words: [176, 194, 212] };

const Node: React.FC<{ u: number; label: string; ours?: boolean; w: number; style?: React.CSSProperties }> = ({ u, label, ours, w, style }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: 92 * u,
      marginLeft: -w / 2,
      marginTop: -46 * u,
      borderRadius: 24 * u,
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      fontFamily: BODY,
      fontWeight: ours ? 750 : 650,
      fontSize: 28 * u,
      lineHeight: 1.15,
      color: ours ? "#fff" : C.ink3,
      background: ours ? `linear-gradient(120deg, ${C.cobalt}, ${G.violet})` : "#FBFCFF",
      zIndex: 2,
      boxShadow: ours
        ? `0 ${20 * u}px ${50 * u}px -${16 * u}px rgba(123,92,255,0.6), 0 0 ${40 * u}px rgba(30,200,240,0.3)`
        : `inset 0 0 0 ${2 * u}px ${C.line}`,
      ...style,
    }}
  >
    {label}
  </div>
);

export const Why: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  /* Positions: rows in 16:9, columns in 9:16 */
  const nodeW = (v ? 400 : 330) * u;
  const aPos = (i: number) => (v ? { x: 290 * u, y: (580 + i * 240) * u } : { x: (315 + i * 430) * u, y: 450 * u });
  const bPos = (i: number) => (v ? { x: 800 * u, y: (580 + i * 720) * u } : { x: (315 + i * 1290) * u, y: 690 * u });

  /* Agency: one stop at a time */
  let a = aPos(0);
  WHY.stops.forEach((at, i) => {
    if (i === 0) return;
    const p0 = aPos(i - 1);
    const p1 = aPos(i);
    if (frame >= at - 16) {
      const t = interpolate(frame, [at - 16, at], [0, 1], { ...clamp, easing: EASE });
      a = { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t };
    }
  });
  /* Ours: straight through, then back and forth */
  const b0 = bPos(0);
  const b1 = bPos(1);
  const tb = frame < WHY.ours[1] ? interpolate(frame, [WHY.ours[0], WHY.ours[1]], [0, 1], { ...clamp, easing: EASE }) : 0.5 - 0.5 * Math.cos(((frame - WHY.ours[1]) / 36) * Math.PI + Math.PI);
  const b = { x: b0.x + (b1.x - b0.x) * tb, y: b0.y + (b1.y - b0.y) * tb };
  const lineOn = interpolate(frame, [WHY.ours[0] - 20, WHY.ours[0]], [0, 1], clamp);

  const dot = (p: { x: number; y: number }, color: string, glow: boolean, on: number) => (
    <div style={{ position: "absolute", left: p.x - 14 * u, top: p.y - 14 * u, width: 28 * u, height: 28 * u, borderRadius: "50%", background: color, boxShadow: glow ? `0 0 ${24 * u}px ${G.cyan}, 0 0 ${50 * u}px ${G.violet}` : "none", opacity: on, zIndex: 1 }} />
  );

  return (
    <GlowBg strength={1.1} style={useExit(duration)}>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 170 : 110) * u, right: (v ? 80 : 150) * u }}>
        <Display size={(v ? 112 : 104) * u} style={useEnter(2, 30)}>
          Why we can give you better value.
        </Display>
      </div>
      <Eyebrow u={u} color={C.ink3} style={{ position: "absolute", left: v ? 90 * u : 150 * u, top: v ? 450 * u : 340 * u, ...useEnter(8, 16) }}>
        Agency model
      </Eyebrow>
      <Eyebrow u={u} color={C.cobalt} style={{ position: "absolute", left: v ? 600 * u : 150 * u, top: v ? 450 * u : 580 * u, ...useEnter(84, 16) }}>
        Our model
      </Eyebrow>
      {/* agency connectors */}
      {AGENCY_FLOW.slice(1).map((_, i) => {
        const p0 = aPos(i);
        const p1 = aPos(i + 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.min(p0.x, p1.x) - (v ? 1.5 * u : 0),
              top: Math.min(p0.y, p1.y) - (v ? 0 : 1.5 * u),
              width: v ? 3 * u : Math.abs(p1.x - p0.x),
              height: v ? Math.abs(p1.y - p0.y) : 3 * u,
              backgroundImage: `repeating-linear-gradient(${v ? 180 : 90}deg, ${C.ink3} 0 ${10 * u}px, transparent ${10 * u}px ${20 * u}px)`,
              opacity: 0.45 * interpolate(frame, [10 + i * 6, 20 + i * 6], [0, 1], clamp),
            }}
          />
        );
      })}
      {AGENCY_FLOW.map((n, i) => {
        const p = aPos(i);
        return <Node key={n} u={u} w={nodeW} label={n} style={{ left: p.x, top: p.y, ...useEnter(6 + i * 8, 24) }} />;
      })}
      {dot(a, C.ink3, false, interpolate(frame, [14, 20], [0, 1], clamp))}
      {/* our connector: one direct, glowing line */}
      <div
        style={{
          position: "absolute",
          left: v ? b0.x - 3 * u : b0.x,
          top: v ? b0.y : b0.y - 3 * u,
          width: v ? 6 * u : (b1.x - b0.x) * lineOn,
          height: v ? (b1.y - b0.y) * lineOn : 6 * u,
          borderRadius: 99,
          background: `linear-gradient(${v ? 180 : 90}deg, ${C.cobalt}, ${G.cyan}, ${G.violet})`,
          boxShadow: `0 0 ${24 * u}px rgba(30,200,240,0.6)`,
        }}
      />
      <Node u={u} w={nodeW} label="Client" ours style={{ left: b0.x, top: b0.y, ...usePop(80) }} />
      <Node u={u} w={nodeW} label="Engineers" ours style={{ left: b1.x, top: b1.y, ...usePop(88) }} />
      {dot(b, "#fff", true, interpolate(frame, [WHY.ours[0], WHY.ours[0] + 4], [0, 1], clamp))}
      <div
        style={{
          position: "absolute",
          left: (v ? 80 : 150) * u,
          right: (v ? 80 : 150) * u,
          top: (v ? 1460 : 860) * u,
          display: "flex",
          flexDirection: v ? "column" : "row",
          justifyContent: "center",
          gap: (v ? 6 : 36) * u,
          fontFamily: DISPLAY,
          fontWeight: 760,
          letterSpacing: "-0.03em",
          fontSize: (v ? 92 : 76) * u,
          lineHeight: 1.05,
        }}
      >
        <span style={usePop(WHY.words[0])}>Fewer layers.</span>
        <span style={{ ...usePop(WHY.words[1]), ...glowText() }}>Direct collaboration.</span>
        <span style={usePop(WHY.words[2])}>Better value.</span>
      </div>
    </GlowBg>
  );
};

/* ── 13. Final: the promise, the call to action, the logo ─────────── */
export const FINAL = { press: 112, wipe: 146, logo: 158 };

export const Final: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v, width, height } = useLayout();
  const wipe = interpolate(frame, [FINAL.wipe, FINAL.wipe + 18], [0, 1], { ...clamp, easing: EASE });
  const press = interpolate(frame, [FINAL.press, FINAL.press + 4, FINAL.press + 10], [1, 0.93, 1], clamp);
  const logo = spring({ frame: frame - FINAL.logo, fps, config: { damping: 9, stiffness: 140, mass: 0.7 } });
  const btnX = v ? width / 2 : 370 * u;
  const btnY = v ? height * 0.66 : 724 * u;
  const radius = Math.hypot(width, height) * wipe;

  return (
    <AbsoluteFill>
      <GlowBg strength={1.5}>
        <Particles n={34} seed="final" size={6} />
      </GlowBg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: v ? "center" : "flex-start",
          padding: v ? `0 ${80 * u}px` : `${150 * u}px ${150 * u}px`,
          opacity: interpolate(frame, [FINAL.wipe, FINAL.wipe + 10], [1, 0], clamp),
        }}
      >
        <Display size={(v ? 136 : 118) * u} style={useEnter(4, 40)}>
          Premium websites.
        </Display>
        <Display size={(v ? 136 : 118) * u} style={{ ...useEnter(14, 40) }}>
          <span style={glowText()}>Smarter pricing.</span>
        </Display>
        <Body size={(v ? 46 : 46) * u} color={C.ink2} style={{ marginTop: 30 * u, ...useEnter(34, 24) }}>
          Built by engineers. Made for your business.
        </Body>
        <Display size={(v ? 76 : 72) * u} style={{ marginTop: (v ? 100 : 80) * u, ...useEnter(64, 30) }}>
          Let's build something great.
        </Display>
        <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: v ? "stretch" : "center", gap: (v ? 30 : 44) * u, marginTop: (v ? 50 : 40) * u }}>
          <div
            style={{
              padding: `${28 * u}px ${54 * u}px`,
              borderRadius: 999,
              background: frame >= FINAL.press + 4 ? C.cobaltDeep : `linear-gradient(120deg, ${C.cobalt}, ${G.violet})`,
              boxShadow: `0 ${20 * u}px ${50 * u}px -${16 * u}px rgba(123,92,255,0.7)`,
              color: "#fff",
              fontFamily: BODY,
              fontWeight: 750,
              fontSize: 38 * u,
              textAlign: "center",
              scale: String(press),
              ...usePop(80),
            }}
          >
            Book a free call
          </div>
          <div style={useEnter(92, 20)}>
            <Body size={(v ? 46 : 40) * u} color={C.ink} style={{ fontWeight: 750, textAlign: v ? "center" : "left" }}>
              hibrands.in
            </Body>
            <Body size={(v ? 40 : 34) * u} color={C.ink2} style={{ textAlign: v ? "center" : "left" }}>
              +91 90649 90515
            </Body>
          </div>
        </div>
      </div>

      {!v ? (
        <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [FINAL.wipe, FINAL.wipe + 10], [1, 0], clamp) }}>
          <div style={{ position: "absolute", left: 1230 * u, top: 230 * u, rotate: "-2deg", ...useEnter(20, 80, 30) }}>
            <BrowserFrame u={u} width={580 * u} height={380 * u} src="site/home-full.jpg" url="hibrands.in" scrollY={interpolate(frame, [30, FINAL.wipe], [0, 520 * u], { ...clamp, easing: EASE })} style={{ boxShadow: `0 ${50 * u}px ${100 * u}px -${30 * u}px rgba(123,92,255,0.55), 0 0 ${80 * u}px rgba(30,200,240,0.3)` }} />
          </div>
          <div style={{ position: "absolute", left: 1620 * u, top: 470 * u, ...useEnter(34, 120, 30) }}>
            <PhoneFrame u={u} width={215 * u} src="site/home-phone-full.jpg" scrollY={interpolate(frame, [40, FINAL.wipe], [0, 700 * u], { ...clamp, easing: EASE })} />
          </div>
        </div>
      ) : null}

      {/* Gradient wipe from the button, then the logo */}
      <div
        style={{
          position: "absolute",
          left: btnX - radius,
          top: btnY - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.cobaltDeep} 0%, ${C.cobalt} 45%, ${G.violet} 100%)`,
          overflow: "hidden",
        }}
      />
      <AbsoluteFill style={{ opacity: frame >= FINAL.logo - 4 ? 1 : 0, background: `radial-gradient(70% 60% at 50% 45%, rgba(30,200,240,0.28), transparent 70%)` }}>
        <Particles n={50} seed="end" colors={["#ffffff", G.cyan, "#FFD66B"]} size={5} opacity={0.6} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: frame >= FINAL.logo ? 1 : 0,
          scale: String(interpolate(frame, [FINAL.logo, duration], [1, 1.05], clamp)),
        }}
      >
        <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: (v ? 36 : 48) * u }}>
          <HiMark
            size={(v ? 260 : 230) * u}
            style={{
              scale: String(interpolate(logo, [0, 1], [0.2, 1])),
              rotate: `${interpolate(logo, [0, 1], [-18, 0])}deg`,
              filter: `drop-shadow(0 0 ${50 * u}px rgba(255,200,61,0.55))`,
            }}
          />
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: (v ? 150 : 180) * u, letterSpacing: "-0.055em", lineHeight: 1, color: "#fff", ...useEnter(FINAL.logo + 6, 30) }}>
            <span style={{ color: C.marigold }}>Hi</span>Brands
          </div>
        </div>
        <Body size={(v ? 48 : 46) * u} color="#fff" style={{ marginTop: 46 * u, fontWeight: 650, textAlign: "center", ...useEnter(FINAL.logo + 18, 20) }}>
          Engineers, not an agency.
        </Body>
        <Body size={(v ? 38 : 34) * u} color="rgba(255,255,255,0.82)" style={{ marginTop: 14 * u, textAlign: "center", ...useEnter(FINAL.logo + 28, 20) }}>
          hibrands.in · +91 90649 90515
        </Body>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
