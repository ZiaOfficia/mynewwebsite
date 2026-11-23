import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Body, Card, Display, HiMark, Strike, useEnter, useExit, usePop } from "../components";
import { BODY, C, DISPLAY, EASE, clamp, useLayout } from "../theme";

type SceneProps = { duration: number };

/* ── 1. Intro: the Hi bubble says hi ─────────────────────────────────── */
export const Intro: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v } = useLayout();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 9, stiffness: 140, mass: 0.7 } });
  const reveal = interpolate(frame, [16, 40], [0, 1], { ...clamp, easing: EASE });
  const bubble = (v ? 300 : 280) * u;

  return (
    <AbsoluteFill style={{ background: C.paper, justifyContent: "center", alignItems: "center", ...useExit(duration) }}>
      <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: (v ? 40 : 56) * u }}>
        <HiMark
          size={bubble}
          style={{
            scale: String(interpolate(pop, [0, 1], [0.2, 1])),
            rotate: `${interpolate(pop, [0, 1], [-18, 0])}deg`,
            opacity: interpolate(frame, [6, 10], [0, 1], clamp),
            filter: `drop-shadow(0 ${24 * u}px ${30 * u}px rgba(214,150,0,0.3))`,
          }}
        />
        <div style={{ clipPath: v ? `inset(0 0 ${100 - reveal * 100}% 0)` : `inset(0 ${100 - reveal * 100}% 0 0)` }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: (v ? 170 : 210) * u,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              color: C.ink,
              translate: v ? `0px ${(1 - reveal) * 40 * u}px` : `${(1 - reveal) * -60 * u}px 0px`,
            }}
          >
            <span style={{ color: C.cobalt }}>Hi</span>Brands
          </div>
        </div>
      </div>
      <Body
        size={(v ? 48 : 46) * u}
        color={C.ink2}
        style={{ position: "absolute", bottom: (v ? 520 : 200) * u, textAlign: "center", ...useEnter(52, 24) }}
      >
        Engineers, not an agency.
      </Body>
    </AbsoluteFill>
  );
};

/* ── 2. The question ─────────────────────────────────────────────────── */
export const Question: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const lines = ["Ever wondered", "what an agency", "bill actually", "pays for?"];
  const q = usePop(64);
  return (
    <AbsoluteFill
      style={{
        background: C.paper,
        justifyContent: "center",
        padding: v ? `0 ${80 * u}px` : `0 ${150 * u}px`,
        ...useExit(duration),
      }}
    >
      {lines.map((line, i) => (
        <div key={line} style={{ overflow: "hidden", paddingBottom: 8 * u }}>
          <Display
            size={(v ? 128 : 150) * u}
            style={{
              translate: `0px ${interpolate(frame, [6 + i * 18, 22 + i * 18], [110, 0], { ...clamp, easing: EASE })}%`,
            }}
          >
            {line}
          </Display>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: (v ? 70 : 170) * u,
          top: v ? 230 * u : "50%",
          translate: v ? "0 0" : "0 -50%",
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: (v ? 360 : 560) * u,
          lineHeight: 1,
          color: C.marigold,
          rotate: `${interpolate(frame, [64, 100], [-20, 8], { ...clamp, easing: EASE })}deg`,
          ...q,
        }}
      >
        ?
      </div>
    </AbsoluteFill>
  );
};

/* ── 3. The agency bill, unbundled ───────────────────────────────────── */
const BILL = [
  ["Account manager", "Overhead"],
  ["Office rent and upkeep", "Overhead"],
  ["HR and admin staff", "Overhead"],
  ["Sales team commission", "Overhead"],
  ["Agency profit margin", "Markup"],
  ["The actual work", "Work"],
] as const;

export const Bill: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const STRIKE_AT = 72;
  const WORK_AT = 164;
  const SWAP_AT = 196;
  const direct = frame >= WORK_AT;
  const cardW = (v ? 920 : 760) * u;
  const rowH = (v ? 92 : 84) * u;

  const head = (
    <div style={{ position: "relative", width: v ? "100%" : 760 * u, height: (v ? 380 : 420) * u }}>
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [SWAP_AT - 8, SWAP_AT], [1, 0], clamp) }}>
        <div style={useEnter(4, 30)}>
          <Display size={(v ? 104 : 112) * u}>Where an agency bill really goes.</Display>
          <Body size={(v ? 44 : 40) * u} style={{ marginTop: 28 * u, maxWidth: 680 * u }}>
            Most of it keeps the agency running.
          </Body>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(frame, [SWAP_AT, SWAP_AT + 10], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [SWAP_AT, SWAP_AT + 18], [30, 0], { ...clamp, easing: EASE }) * u}px`,
        }}
      >
        <Display size={(v ? 104 : 112) * u}>You pay for the work.</Display>
        <Display size={(v ? 104 : 112) * u} color={C.cobalt} style={{ marginTop: 10 * u }}>
          Not the agency around it.
        </Display>
      </div>
    </div>
  );

  const card = (
    <Card
      u={u}
      style={{
        width: cardW,
        padding: `${36 * u}px ${40 * u}px ${30 * u}px`,
        ...useEnter(8, 60, 22),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 22 * u,
          borderBottom: `${3 * u}px dashed ${C.line}`,
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 38 * u, color: C.ink, letterSpacing: "-0.02em" }}>
          What your money pays for
        </span>
        <span
          style={{
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 24 * u,
            padding: `${8 * u}px ${18 * u}px`,
            borderRadius: 99,
            background: direct ? C.ink : C.paper,
            color: direct ? "#fff" : C.ink2,
          }}
        >
          {direct ? "HiBrands" : "An agency"}
        </span>
      </div>
      {BILL.map(([label, kind], i) => {
        const work = i === BILL.length - 1;
        const s = STRIKE_AT + i * 18;
        const strike = work ? 0 : interpolate(frame, [s, s + 10], [0, 1], { ...clamp, easing: EASE });
        const struck = !work && frame >= s + 4;
        const mint = work ? interpolate(frame, [WORK_AT, WORK_AT + 10], [0, 1], clamp) : 0;
        return (
          <div
            key={label}
            style={{
              height: rowH,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${14 * u}px`,
              marginTop: work ? 10 * u : 0,
              borderBottom: work ? "none" : `${1.5 * u}px solid ${C.line}`,
              borderRadius: work ? 18 * u : 0,
              background: `rgba(198,238,219,${mint})`,
              ...useEnter(14 + i * 6, 24, 14),
            }}
          >
            <span
              style={{
                position: "relative",
                fontFamily: BODY,
                fontWeight: work ? 750 : 520,
                fontSize: 34 * u,
                color: struck ? C.ink3 : C.ink,
              }}
            >
              {label}
              {!work && <Strike progress={strike} u={u} />}
            </span>
            <span
              style={{
                fontFamily: BODY,
                fontWeight: 650,
                fontSize: 22 * u,
                padding: `${6 * u}px ${14 * u}px`,
                borderRadius: 99,
                background: work && direct ? C.surface : struck ? "transparent" : C.paper,
                color: work && direct ? C.mintInk : C.ink3,
              }}
            >
              {work && direct ? "All of it" : kind}
            </span>
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 18 * u, marginTop: 24 * u }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 76 * u, color: C.ink, lineHeight: 1, width: 50 * u }}>
          {direct ? 1 : 6}
        </span>
        <Body size={28 * u}>
          {direct ? "thing on your bill. Every rupee goes into the work." : "things on your bill. Only one is the work."}
        </Body>
      </div>
    </Card>
  );

  return (
    <AbsoluteFill
      style={{
        background: C.paperDeep,
        flexDirection: v ? "column" : "row",
        alignItems: "center",
        justifyContent: v ? "center" : "space-between",
        padding: v ? `${120 * u}px ${80 * u}px` : `0 ${150 * u}px`,
        gap: 60 * u,
        ...useExit(duration),
      }}
    >
      {head}
      {card}
    </AbsoluteFill>
  );
};

/* ── 4. Fewer people in the middle ───────────────────────────────────── */
const CHAIN = ["You", "Sales rep", "Account manager", "Project manager", "Engineer"];

export const Chain: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v, width, height } = useLayout();
  const COLLAPSE = 126;
  const c = spring({ frame: frame - COLLAPSE, fps, config: { damping: 16, stiffness: 120 } });

  // Node centres before and after the collapse
  const span = v ? 940 * u : 1540 * u;
  const startMain = v ? 600 * u : (width - span) / 2;
  const before = CHAIN.map((_, i) => startMain + (span / (CHAIN.length - 1)) * i);
  const center = v ? startMain + span / 2 : width / 2;
  const gap = v ? 420 * u : 640 * u;
  const after = CHAIN.map((_, i) => (i === 0 ? center - gap / 2 : i === CHAIN.length - 1 ? center + gap / 2 : center));
  const pos = before.map((b, i) => interpolate(c, [0, 1], [b, after[i]]));
  const cross = v ? width / 2 : 600 * u;

  const node = (label: string, i: number) => {
    const edge = i === 0 || i === CHAIN.length - 1;
    const p = usePop(18 + i * 18);
    const gone = edge ? 1 : interpolate(c, [0, 0.7], [1, 0], clamp);
    const big = i === CHAIN.length - 1 ? interpolate(c, [0, 1], [1, 1.25]) : i === 0 ? interpolate(c, [0, 1], [1, 1.15]) : 1;
    return (
      <div
        key={label}
        style={{
          position: "absolute",
          left: v ? cross : pos[i],
          top: v ? pos[i] : cross,
          translate: "-50% -50%",
          ...p,
          scale: String(parseFloat(String(p.scale)) * gone * big),
          opacity: (p.opacity as number) * gone,
          padding: `${20 * u}px ${34 * u}px`,
          borderRadius: 999,
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 34 * u,
          whiteSpace: "nowrap",
          background: i === 0 ? C.ink : i === CHAIN.length - 1 ? C.cobalt : C.surface,
          color: edge ? "#fff" : C.ink,
          boxShadow: `0 ${16 * u}px ${36 * u}px -${18 * u}px rgba(24,33,61,0.4)`,
          border: edge ? "none" : `${2 * u}px solid ${C.line}`,
        }}
      >
        {label}
      </div>
    );
  };

  const lineStart = pos[0];
  const lineEnd = pos[CHAIN.length - 1];
  const lineGrow = interpolate(frame, [18, 100], [0, 1], { ...clamp, easing: EASE });
  const mintLine = interpolate(c, [0.3, 1], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.paper, ...useExit(duration) }}>
      <div style={{ position: "absolute", left: (v ? 80 : 150) * u, top: (v ? 170 : 130) * u, right: (v ? 80 : 150) * u }}>
        <Display size={(v ? 104 : 112) * u} style={useEnter(2, 30)}>
          Fewer people in the middle.
        </Display>
        <Body size={(v ? 44 : 40) * u} style={{ marginTop: 24 * u, ...useEnter(148, 20) }}>
          With HiBrands, you talk to the engineer who builds it.
        </Body>
      </div>
      {/* connector */}
      <div
        style={{
          position: "absolute",
          left: v ? cross : lineStart,
          top: v ? lineStart : cross,
          width: v ? 6 * u : (lineEnd - lineStart) * lineGrow,
          height: v ? (lineEnd - lineStart) * lineGrow : 6 * u,
          translate: v ? "-50% 0" : "0 -50%",
          borderRadius: 99,
          background: `color-mix(in srgb, ${C.mintInk} ${mintLine * 100}%, ${C.line})`,
        }}
      />
      {CHAIN.map(node)}
      <Body
        size={30 * u}
        color={C.ink3}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          top: v ? height - 250 * u : cross + 110 * u,
          opacity: interpolate(frame, [100, 110, COLLAPSE - 6, COLLAPSE], [0, 1, 1, 0], clamp),
        }}
      >
        4 hand-offs. Each one adds cost and time.
      </Body>
    </AbsoluteFill>
  );
};
