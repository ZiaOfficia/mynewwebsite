import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HiMark } from "../components";
import { BODY, C, DISPLAY, EASE, clamp, useLayout } from "../theme";
import { Burst, G, GlowBg, NightBg, Particles, glowText } from "../v2/kit";
import { Counter, ENGINEERS, EXPR, Expr, LaptopBack, Monitor, OWNER, Person, Set, Shop, Workspace, blend, mix } from "./art";
import timeline from "./timeline.json";

type P = { duration: number };
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: EASE });

/* ── Captions: blur-in subtitles (technique from remocn's blur-reveal) ── */
export const Captions: React.FC<{ scene: string }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { u, v } = useLayout();
  const list = timeline.captions.filter((c) => c.scene === scene && c.style !== "title");
  return (
    <>
      {list.map((c) => {
        if (frame < c.from - 2 || frame > c.to + 8) return null;
        const t = interpolate(frame, [c.from, c.from + 12], [0, 1], { ...clamp, easing: EASE });
        const out = interpolate(frame, [c.to - 6, c.to + 4], [1, 0], clamp);
        const thought = c.style === "thought";
        const quote = c.style === "quote";
        return (
          <div
            key={c.from}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: (v ? 230 : 64) * u,
              display: "flex",
              justifyContent: "center",
              padding: `0 ${(v ? 60 : 160) * u}px`,
              opacity: t * out,
              filter: `blur(${(1 - t) * 10}px)`,
              translate: `0px ${(1 - t) * 14 * u}px`,
              zIndex: 50,
            }}
          >
            <div
              style={{
                maxWidth: (v ? 960 : 1500) * u,
                padding: `${(v ? 22 : 16) * u}px ${(v ? 34 : 34) * u}px`,
                borderRadius: 22 * u,
                background: thought ? "rgba(20,22,34,0.72)" : quote ? "rgba(26,22,70,0.72)" : "rgba(12,16,32,0.62)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                fontFamily: thought || quote ? DISPLAY : BODY,
                fontStyle: thought ? "italic" : "normal",
                fontWeight: thought || quote ? 700 : 600,
                letterSpacing: thought || quote ? "-0.01em" : "0",
                fontSize: (v ? 52 : 46) * u,
                lineHeight: 1.25,
                textAlign: "center",
                textWrap: "balance",
                boxShadow: quote ? `0 0 0 ${2 * u}px rgba(123,92,255,0.6)` : "none",
              }}
            >
              {c.text}
            </div>
          </div>
        );
      })}
    </>
  );
};

/* Colour grade for each emotional stage */
const Grade: React.FC<{ warm?: number; cold?: number; dim?: number; children: React.ReactNode }> = ({ warm = 0, cold = 0, dim = 0, children }) => (
  <AbsoluteFill style={{ filter: `saturate(${1 - cold * 0.55 + warm * 0.15}) brightness(${1 - dim * 0.25 + warm * 0.04}) contrast(${1 - cold * 0.08})` }}>
    {children}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(60,90,150,0.9), rgba(30,40,80,0.9))", mixBlendMode: "multiply", opacity: cold * 0.32 }} />
    <AbsoluteFill style={{ background: "radial-gradient(70% 70% at 82% 30%, rgba(255,196,110,0.9), rgba(255,170,80,0.2) 60%, transparent 80%)", mixBlendMode: "soft-light", opacity: warm }} />
  </AbsoluteFill>
);

const FadeIn: React.FC<{ frames?: number; color?: string; children: React.ReactNode }> = ({ frames = 10, color = "#000", children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: color }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, frames], [0, 1], clamp) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* The owner behind his counter, in shop coordinates */
const OwnerInShop: React.FC<{ e: Expr; pose: "rest" | "fold" | "type" | "chin" | "heart" }> = ({ e, pose }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 5) * 6;
  const hands: Record<string, { l: [number, number]; r: [number, number]; le?: [number, number]; re?: [number, number] }> = {
    rest: { l: [150, 470], r: [250, 470] },
    fold: { l: [138 + wob, 436], r: [252 - wob, 440] },
    type: { l: [176 + (frame % 8 < 4 ? 4 : -2), 470], r: [228 + (frame % 10 < 5 ? -3 : 3), 468] },
    chin: { l: [150, 470], r: [206, 292], re: [300, 430] },
    heart: { l: [186, 352], r: [216, 360], le: [110, 430], re: [292, 430] },
  };
  const h = hands[pose];
  return (
    <div style={{ position: "absolute", left: 710, top: 205, width: 500, height: 700 }}>
      <Person look={OWNER} e={e} left={{ hand: h.l, elbow: h.le }} right={{ hand: h.r, elbow: h.re }} seed="owner" />
    </div>
  );
};

/* ── 1. A dream ──────────────────────────────────────────────────────── */
export const Dream: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const look = ease(frame, 150, 180);
  const e = blend(EXPR.content, { ...EXPR.hopeful, lookX: 0.9, lookY: 0 }, look);
  return (
    <FadeIn frames={18}>
      <Grade warm={0.25} cold={0.15}>
        <Set w={width} h={height} zoom={interpolate(frame, [0, duration], [1, 1.12])} originY={480} focusY={0.47}>
          <Shop />
          <OwnerInShop e={e} pose={frame < 150 ? "fold" : "rest"} />
          <Counter />
        </Set>
      </Grade>
      <Captions scene="dream" />
    </FadeIn>
  );
};

/* ── 2. The barrier ──────────────────────────────────────────────────── */
const PROPOSALS = ["Website Development", "Brand Identity", "SEO Retainer", "Social Media Management", "Performance Ads"];

const Proposals: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, v, u } = useLayout();
  const sw = v ? width * 0.92 : width * 0.78;
  const sh = v ? height * 0.62 : height * 0.78;
  return (
    <AbsoluteFill style={{ background: "#151925", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: sw, height: sh, borderRadius: 26 * u, background: "#0E1018", padding: 18 * u, boxShadow: "0 40px 120px rgba(0,0,0,0.6)", scale: String(interpolate(frame, [110, 260], [1, 1.04])) }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 12 * u, overflow: "hidden", background: "linear-gradient(180deg, #E7EAF1, #D7DBE5)" }}>
          <div style={{ height: 46 * u, background: "#C9CED9", display: "flex", alignItems: "center", gap: 10 * u, paddingLeft: 18 * u }}>
            {["#E3A29A", "#E8CF8A", "#9FCFA9"].map((c) => <span key={c} style={{ width: 13 * u, height: 13 * u, borderRadius: "50%", background: c }} />)}
            <span style={{ marginLeft: 12 * u, fontFamily: BODY, fontSize: 18 * u, color: "#5B6275" }}>Inbox · Proposals</span>
          </div>
          {PROPOSALS.map((t, i) => {
            const at = 120 + i * 22;
            const p = spring({ frame: frame - at, fps: 30, config: { damping: 16, stiffness: 140 } });
            const cw = (v ? 640 : 700) * u;
            const x = (v ? sw * 0.5 - cw / 2 : sw * 0.5 - cw / 2) + (i - 2) * (v ? 34 : 70) * u;
            const y = (v ? 110 : 80) * u + i * (v ? 70 : 46) * u;
            return (
              <div
                key={t}
                style={{
                  position: "absolute",
                  left: x,
                  top: y + (1 - p) * 500 * u,
                  width: cw,
                  padding: 26 * u,
                  borderRadius: 14 * u,
                  background: "#fff",
                  rotate: `${(i - 2) * 2.4}deg`,
                  boxShadow: "0 24px 50px -20px rgba(20,25,45,0.5)",
                  opacity: frame >= at ? 1 : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 * u }}>
                  <span style={{ width: 34 * u, height: 34 * u, borderRadius: 8 * u, background: ["#5B6B8C", "#8C5B6B", "#5B8C7A", "#7A5B8C", "#8C7A5B"][i] }} />
                  <div style={{ fontFamily: BODY, fontSize: 15 * u, color: "#8A90A0", letterSpacing: "0.12em", textTransform: "uppercase" }}>Proposal</div>
                </div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: 38 * u, color: "#1E2333", marginTop: 12 * u, letterSpacing: "-0.02em" }}>{t}</div>
                {[90, 72, 84].map((w, k) => <div key={k} style={{ height: 10 * u, width: `${w}%`, borderRadius: 5 * u, background: "#E3E6ED", marginTop: 12 * u }} />)}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 * u, paddingTop: 14 * u, borderTop: `${1.5 * u}px solid #E3E6ED` }}>
                  <span style={{ fontFamily: BODY, fontWeight: 650, fontSize: 18 * u, color: "#5B6275" }}>Total investment</span>
                  <span style={{ width: 150 * u, height: 22 * u, borderRadius: 4 * u, background: "#2A2F40" }} />
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 26 * u, textAlign: "center", fontFamily: BODY, fontWeight: 650, fontSize: 24 * u, color: "#5B6275", opacity: ease(frame, 236, 250) }}>
            5 services · 5 providers · 5 separate bills
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Barrier: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const low = frame >= 260;
  const sadT = ease(frame, 262, 320);
  const e = low ? blend(EXPR.worried, EXPR.sad, sadT) : blend(EXPR.hopeful, { ...EXPR.focus, lookX: 0, lookY: 0.7 }, ease(frame, 30, 60));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {frame < 110 || low ? (
        <Grade warm={low ? 0 : 0.1} cold={low ? interpolate(frame, [260, 330], [0.5, 1], clamp) : 0.35} dim={low ? interpolate(frame, [260, 340], [0.3, 1], clamp) : 0}>
          <Set
            w={width}
            h={height}
            zoom={low ? interpolate(frame, [260, duration], [1.12, 1.42]) : interpolate(frame, [0, 110], [1.04, 1.1])}
            originY={430}
            focusY={0.44}
          >
            <Shop />
            <OwnerInShop e={e} pose={low ? (frame > 296 ? "chin" : "rest") : frame > 30 ? "type" : "rest"} />
            <LaptopBack x={810} y={590} open={low ? 1 : interpolate(frame, [10, 30], [0.15, 1], clamp)} glow={low ? "#7FA8FF" : "#BFD8FF"} />
            <Counter />
          </Set>
        </Grade>
      ) : (
        <Grade cold={0.4}>
          <Proposals />
        </Grade>
      )}
      <Captions scene="barrier" />
    </AbsoluteFill>
  );
};

/* ── 3. The realization: four engineers, four workspaces ─────────────── */
const ScreenTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, color: "#1E2333", padding: "18px 22px 8px" }}>{children}</div>
);

const MapScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, background: "#E8EEF3" }}>
      <ScreenTitle>Shops near you</ScreenTitle>
      <svg viewBox="0 0 600 340" style={{ position: "absolute", left: 0, top: 50, width: "100%", height: "85%" }}>
        <path d="M0,120 L600,90 M0,250 L600,280 M150,0 L190,340 M420,0 L380,340" stroke="#fff" strokeWidth={22} />
        {[
          [120, 80],
          [300, 170],
          [470, 120],
          [220, 270],
          [520, 250],
        ].map(([x, y], i) => (
          <g key={i} opacity={interpolate(frame, [20 + i * 8, 28 + i * 8], [0, 1], clamp)}>
            <circle cx={x} cy={y} r={14} fill="#E06A5A" />
            <rect x={x + 18} y={y - 16} width={112} height={30} rx={8} fill="#fff" />
            <text x={x + 28} y={y + 5} fontSize={17} fontFamily="Geist" fontWeight={700} fill="#C0392B">
              No website
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const BrandScreen: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#F6F2EA", padding: 24 }}>
    <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, color: "#1E2333" }}>Brand check</div>
    <div style={{ display: "flex", gap: 18, marginTop: 20 }}>
      {["Sharma", "SHARMA GMT", "sharma garments"].map((t, i) => (
        <div key={t} style={{ flex: 1, height: 110, borderRadius: 10, background: ["#7A2E2E", "#2E5A7A", "#5A7A2E"][i], display: "grid", placeItems: "center", color: "#fff", fontFamily: i === 1 ? "monospace" : i === 2 ? "Georgia" : DISPLAY, fontSize: 22 }}>
          {t}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 22, fontFamily: BODY, fontSize: 22, color: "#B5502A", fontWeight: 700 }}>3 different looks. No consistent identity.</div>
  </div>
);

const SearchScreen: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 24 }}>
    <div style={{ borderRadius: 99, background: "#F1F3F7", padding: "12px 22px", fontFamily: BODY, fontSize: 22, color: "#3B4256" }}>clothing shop near me</div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ marginTop: 18 }}>
        <div style={{ height: 12, width: "40%", background: "#C9D3F5", borderRadius: 6 }} />
        <div style={{ height: 10, width: "80%", background: "#EEF0F5", borderRadius: 5, marginTop: 8 }} />
      </div>
    ))}
    <div style={{ marginTop: 22, fontFamily: BODY, fontSize: 22, color: "#B5502A", fontWeight: 700 }}>Sharma Garments: not found</div>
  </div>
);

const SocialScreen: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ width: 70, height: 70, borderRadius: "50%", background: "#E5E7EE" }} />
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, color: "#1E2333" }}>sharmagarments</div>
        <div style={{ fontFamily: BODY, fontSize: 20, color: "#6A7186" }}>0 posts · no reviews</div>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 20 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ height: 70, background: "#F1F3F7", borderRadius: 6 }} />
      ))}
    </div>
  </div>
);

const TEAM = [
  { key: "dev", night: true, tint: "#3050F0", role: "Developer", Screen: MapScreen },
  { key: "design", night: false, tint: "#E2A23B", role: "Designer", Screen: BrandScreen },
  { key: "seo", night: true, tint: "#7B5CFF", role: "SEO specialist", Screen: SearchScreen },
  { key: "ads", night: false, tint: "#2E9E6B", role: "Ads & social", Screen: SocialScreen },
] as const;

/* An engineer at their desk, framed for a panel */
const EngineerPanel: React.FC<{ i: number; w: number; h: number; e: Expr; screen?: boolean; label?: boolean }> = ({ i, w, h, e, screen = true, label = true }) => {
  const m = TEAM[i];
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const typing = frame % 9 < 4 ? 3 : -3;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Set w={w} h={h} originX={screen ? 980 : 760} originY={screen ? 520 : 470} zoom={screen ? 1 : 1.3}>
        <Workspace night={m.night} tint={m.tint}>
          <div style={{ position: "absolute", left: 470, top: 240, width: 560, height: 784 }}>
            <Person look={ENGINEERS[m.key]} e={e} left={{ hand: [150 + typing, 500] }} right={{ hand: [250 - typing, 500] }} seed={m.key} />
          </div>
          {screen ? (
            <Monitor x={1060} y={200} w={720} h={430} night={m.night}>
              <m.Screen />
            </Monitor>
          ) : null}
        </Workspace>
      </Set>
      {label ? (
        <div style={{ position: "absolute", left: 14 * u, top: 14 * u, padding: `${6 * u}px ${14 * u}px`, borderRadius: 99, background: "rgba(10,14,30,0.6)", color: "#fff", fontFamily: BODY, fontWeight: 650, fontSize: 20 * u }}>
          {m.role}
        </div>
      ) : null}
    </div>
  );
};

const panelRects = (width: number, height: number, v: boolean, u: number) => {
  const gap = 14 * u;
  if (v) {
    const top = 120 * u;
    const ph = (height - top - 470 * u - gap * 3) / 4;
    return [0, 1, 2, 3].map((i) => ({ x: 40 * u, y: top + i * (ph + gap), w: width - 80 * u, h: ph }));
  }
  const pw = (width - 120 * u - gap) / 2;
  const ph = (height - 200 * u - gap) / 2;
  return [0, 1, 2, 3].map((i) => ({ x: 60 * u + (i % 2) * (pw + gap), y: 40 * u + Math.floor(i / 2) * (ph + gap), w: pw, h: ph }));
};

export const Realize: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const { width, height, v, u } = useLayout();
  const rects = panelRects(width, height, v, u);
  const connect = ease(frame, 236, 262);
  return (
    <FadeIn frames={12}>
      <NightBg>
        {rects.map((r, i) => {
          const at = i * 28;
          const p = spring({ frame: frame - at, fps: 30, config: { damping: 16, stiffness: 120 } });
          const e = frame < 150 ? EXPR.focus : frame < 250 ? blend(EXPR.focus, EXPR.thinking, ease(frame, 150, 170)) : blend(EXPR.thinking, EXPR.idea, ease(frame, 250, 266));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                borderRadius: 18 * u,
                overflow: "hidden",
                opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
                scale: String(interpolate(p, [0, 1], [0.92, 1])),
                boxShadow: `0 0 0 ${2 * u}px rgba(30,200,240,${0.15 + connect * 0.75}), 0 0 ${60 * u * connect}px rgba(30,200,240,${connect * 0.5})`,
              }}
            >
              <EngineerPanel i={i} w={r.w} h={r.h} e={{ ...e, lookX: frame < 250 ? 0.8 : 0 }} />
            </div>
          );
        })}
        {/* the call connects them */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: v ? rects[1].y + rects[1].h + 7 * u : rects[0].y + rects[0].h + 7 * u,
            translate: "-50% -50%",
            padding: `${12 * u}px ${26 * u}px`,
            borderRadius: 99,
            background: `linear-gradient(120deg, ${C.cobalt}, ${G.violet})`,
            color: "#fff",
            fontFamily: BODY,
            fontWeight: 750,
            fontSize: 26 * u,
            boxShadow: `0 0 ${40 * u}px rgba(30,200,240,0.6)`,
            opacity: connect,
            scale: String(0.8 + connect * 0.2),
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          ● Call connected · 4 engineers
        </div>
      </NightBg>
      <Captions scene="realize" />
    </FadeIn>
  );
};

/* ── 4. HiBrands is born ─────────────────────────────────────────────── */
const SKILLS = ["</>", "✎", "SEO", "♥", "↗"];

export const Birth: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v, width, height } = useLayout();
  const LOGO = 132;
  const converge = ease(frame, 96, LOGO);
  const logo = spring({ frame: frame - LOGO, fps, config: { damping: 10, stiffness: 120, mass: 0.8 } });
  const bright = ease(frame, LOGO - 4, LOGO + 14);
  const cx = width / 2;
  const cy = height * (v ? 0.44 : 0.53);
  const R = (v ? 330 : 300) * u * (1 - converge);
  const title = (from: number, to: number) => interpolate(frame, [from, from + 12, to - 8, to], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <NightBg>
        <Particles n={50} seed="birth" colors={["#8EA2FF", G.cyan, G.violet]} size={4} opacity={0.6} />
      </NightBg>
      <AbsoluteFill style={{ opacity: bright }}>
        <GlowBg strength={1.5}>
          <Particles n={40} seed="birth2" size={6} />
        </GlowBg>
      </AbsoluteFill>
      <svg style={{ position: "absolute", inset: 0 }} width={width} height={height}>
        {SKILLS.map((_, i) => {
          const a = (i / SKILLS.length) * Math.PI * 2 + frame / 90 - Math.PI / 2;
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          const grow = ease(frame, 18 + i * 10, 40 + i * 10);
          return <line key={i} x1={cx} y1={cy} x2={cx + (x - cx) * grow} y2={cy + (y - cy) * grow} stroke={G.cyan} strokeWidth={3 * u} opacity={0.7 * (1 - bright)} />;
        })}
      </svg>
      {SKILLS.map((s, i) => {
        const a = (i / SKILLS.length) * Math.PI * 2 + frame / 90 - Math.PI / 2;
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        const pop = spring({ frame: frame - (18 + i * 10), fps, config: { damping: 12, stiffness: 160 } });
        const size = 120 * u;
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(135deg, ${C.cobalt}, ${G.violet})`,
              color: "#fff",
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 40 * u,
              boxShadow: `0 0 ${40 * u}px rgba(30,200,240,0.6)`,
              scale: String(pop * (1 - converge * 0.7)),
              opacity: 1 - ease(frame, LOGO - 6, LOGO),
            }}
          >
            {s}
          </div>
        );
      })}
      <Burst at={LOGO} x={cx} y={cy} n={80} seed="birthburst" reach={0.8} />
      <div style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%", display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: (v ? 30 : 44) * u, opacity: frame >= LOGO ? 1 : 0 }}>
        <HiMark size={(v ? 240 : 210) * u} style={{ scale: String(interpolate(logo, [0, 1], [0.2, 1])), rotate: `${interpolate(logo, [0, 1], [-18, 0])}deg`, filter: `drop-shadow(0 0 ${40 * u}px rgba(255,200,61,0.55))` }} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: (v ? 150 : 170) * u, letterSpacing: "-0.055em", lineHeight: 1, color: C.ink, opacity: ease(frame, LOGO + 6, LOGO + 20) }}>
          <span style={{ color: C.cobalt }}>Hi</span>Brands
        </div>
      </div>
      {/* titles */}
      <div style={{ position: "absolute", left: 0, right: 0, top: (v ? 200 : 64) * u, textAlign: "center", padding: `0 ${60 * u}px`, fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 84 : 76) * u, letterSpacing: "-0.03em", color: "#fff", opacity: title(12, 118) }}>
        Different skills. <span style={{ color: G.cyan }}>One shared mission.</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + (v ? 330 : 150) * u, textAlign: "center", padding: `0 ${60 * u}px` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 72 : 68) * u, letterSpacing: "-0.03em", color: C.ink, opacity: title(150, 236), position: "absolute", left: 0, right: 0 }}>
          Introducing HiBrands.
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 72 : 68) * u, letterSpacing: "-0.03em", opacity: interpolate(frame, [236, 248], [0, 1], clamp), position: "absolute", left: 0, right: 0 }}>
          <span style={glowText()}>Engineers, not an agency.</span>
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [LOGO - 2, LOGO, LOGO + 14], [0, 0.85, 0], clamp), pointerEvents: "none" }} />
      <AbsoluteFill style={{ opacity: interpolate(frame, [duration - 6, duration], [0, 0], clamp) }} />
    </AbsoluteFill>
  );
};

/* ── The fictional client website, built up in stages ────────────────── */
export const SiteMock: React.FC<{ stage: number; mobile?: boolean; scroll?: number }> = ({ stage, mobile, scroll = 0 }) => {
  const s = (n: number) => Math.max(0, Math.min(1, stage - n));
  const products = ["#C0392B", "#2E86C1", "#F4D03F", "#17A589", "#7D3C98", "#E67E22"];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFF9F1", overflow: "hidden" }}>
      <div style={{ translate: `0px ${-scroll}px` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "16px 18px" : "18px 34px", opacity: s(0), borderBottom: "1px solid #EFE3D0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 8, background: "#7A2E2E", color: "#F4DFA6", display: "grid", placeItems: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 18 }}>SG</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: mobile ? 18 : 22, color: "#3A1F1F", letterSpacing: "0.04em" }}>SHARMA GARMENTS</span>
          </div>
          {!mobile ? (
            <div style={{ display: "flex", gap: 22, fontFamily: BODY, fontSize: 16, color: "#6A5246" }}>
              <span>Collection</span>
              <span>Visit us</span>
              <span style={{ padding: "6px 14px", borderRadius: 99, background: "#2E9E6B", color: "#fff", fontWeight: 700 }}>WhatsApp</span>
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 24, padding: mobile ? "22px 18px" : "34px 34px", opacity: s(1), translate: `0px ${(1 - s(1)) * 30}px` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: mobile ? 34 : 50, lineHeight: 1, color: "#3A1F1F", letterSpacing: "-0.03em" }}>Clothing for every occasion.</div>
            <div style={{ fontFamily: BODY, fontSize: mobile ? 15 : 18, color: "#7A6355", marginTop: 12 }}>Family-run since day one. Visit the shop or order on WhatsApp.</div>
            <div style={{ display: "inline-block", marginTop: 16, padding: "10px 20px", borderRadius: 99, background: "#7A2E2E", color: "#fff", fontFamily: BODY, fontWeight: 700, fontSize: mobile ? 15 : 17 }}>See the collection</div>
          </div>
          <div style={{ flex: 1, minHeight: mobile ? 150 : 200, borderRadius: 16, background: "linear-gradient(135deg, #F4D03F, #E67E22 50%, #C0392B)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${mobile ? 2 : 3}, 1fr)`, gap: 14, padding: mobile ? "0 18px" : "0 34px", opacity: s(2), translate: `0px ${(1 - s(2)) * 30}px` }}>
          {products.slice(0, mobile ? 4 : 6).map((c, i) => (
            <div key={i} style={{ borderRadius: 12, background: "#fff", boxShadow: "0 8px 20px -12px rgba(60,30,20,0.4)", padding: 10 }}>
              <div style={{ height: mobile ? 80 : 90, borderRadius: 8, background: c }} />
              <div style={{ height: 8, width: "70%", background: "#EFE3D0", borderRadius: 4, marginTop: 8 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Browser: React.FC<{ w: number; h: number; url: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, url, children, style }) => (
  <div style={{ width: w, height: h, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 90px -30px rgba(40,30,120,0.5), 0 0 0 1.5px rgba(24,33,61,0.06)", ...style }}>
    <div style={{ height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: C.paper }}>
      {["#FF9C8A", C.marigold, "#7FD6A8"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
      <span style={{ marginLeft: 10, flex: 1, height: 24, borderRadius: 99, background: "#fff", fontFamily: BODY, fontSize: 14, color: C.ink3, display: "flex", alignItems: "center", paddingLeft: 12 }}>{url}</span>
    </div>
    <div style={{ position: "relative", height: h - 40 }}>{children}</div>
  </div>
);

const Phone: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, children, style }) => (
  <div style={{ width: w, height: w * 2.05, borderRadius: w * 0.14, background: "#14161E", padding: w * 0.04, boxShadow: "0 40px 80px -30px rgba(20,20,60,0.6)", ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.11, overflow: "hidden" }}>
      {children}
      <div style={{ position: "absolute", top: 8, left: "50%", translate: "-50% 0", width: w * 0.3, height: 20, borderRadius: 99, background: "#14161E" }} />
    </div>
  </div>
);

const RoleChip: React.FC<{ at: number; label: string; style?: React.CSSProperties }> = ({ at, label, style }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - at, fps: 30, config: { damping: 11, stiffness: 160 } });
  return (
    <div
      style={{
        position: "absolute",
        padding: "10px 20px 10px 12px",
        borderRadius: 99,
        background: "#fff",
        boxShadow: "0 16px 36px -14px rgba(48,80,240,0.55)",
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: 22,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        gap: 10,
        scale: String(interpolate(p, [0, 1], [0.4, 1])),
        opacity: frame >= at ? 1 : 0,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.cobalt}, ${G.violet})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 15 }}>✓</span>
      {label}
    </div>
  );
};

/* ── 5. The work: consultation, then the build ───────────────────────── */
export const Work: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const { u, v, width, height } = useLayout();
  const call = frame < 130;
  const talk = frame > 12 && frame < 80 ? Math.abs(Math.sin(frame / 3)) * 0.35 : 0;
  if (call) {
    const gap = 14 * u;
    const big = v ? { x: 40 * u, y: 120 * u, w: width - 80 * u, h: height * 0.36 } : { x: 60 * u, y: 60 * u, w: width * 0.56, h: height - 260 * u };
    const small = [0, 1, 2, 3].map((i) =>
      v
        ? { x: 40 * u + (i % 2) * ((width - 80 * u + gap) / 2), y: big.y + big.h + gap + Math.floor(i / 2) * (height * 0.16 + gap), w: (width - 80 * u - gap) / 2, h: height * 0.16 }
        : { x: big.x + big.w + gap + (i % 2) * ((width - big.w - 120 * u - gap) / 2 + gap / 2), y: big.y + Math.floor(i / 2) * ((big.h - gap) / 2 + gap), w: (width - big.w - 120 * u - gap * 2) / 2, h: (big.h - gap) / 2 },
    );
    return (
      <FadeIn frames={8} color="#0A0F1E">
        <AbsoluteFill style={{ background: "#0F1426" }}>
          <div style={{ position: "absolute", left: big.x, top: big.y, width: big.w, height: big.h, borderRadius: 18 * u, overflow: "hidden", boxShadow: `0 0 0 ${3 * u}px ${G.cyan}` }}>
            <Grade warm={0.2}>
              <Set w={big.w} h={big.h} zoom={1.25} originY={450}>
                <Shop />
                <OwnerInShop e={{ ...EXPR.hopeful, open: talk, lookY: 0.1 }} pose="rest" />
                <Counter />
              </Set>
            </Grade>
            <div style={{ position: "absolute", left: 14 * u, bottom: 14 * u, padding: `${6 * u}px ${14 * u}px`, borderRadius: 99, background: "rgba(10,14,30,0.6)", color: "#fff", fontFamily: BODY, fontWeight: 650, fontSize: 22 * u }}>
              Sharma Garments
            </div>
          </div>
          {small.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 14 * u, overflow: "hidden" }}>
              <EngineerPanel i={i} w={r.w} h={r.h} screen={false} e={frame > 70 ? EXPR.warm : { ...EXPR.focus, lookX: 0 }} />
            </div>
          ))}
          <div style={{ position: "absolute", left: "50%", bottom: (v ? 560 : 70) * u, translate: "-50% 0", display: "flex", gap: 16 * u }}>
            {["#3A4266", "#3A4266", "#E5484D"].map((c, i) => (
              <span key={i} style={{ width: 64 * u, height: 64 * u, borderRadius: "50%", background: c, display: "grid", placeItems: "center", color: "#fff", fontFamily: BODY, fontSize: 24 * u }}>
                {["🎙", "◉", "✕"][i]}
              </span>
            ))}
          </div>
        </AbsoluteFill>
        <Captions scene="work" />
      </FadeIn>
    );
  }
  // The build montage
  const f = frame - 130;
  const stage = interpolate(frame, [140, 150, 175, 190, 205, 220], [0, 1, 1, 2, 2, 3], clamp);
  const bw = v ? width - 120 * u : 900 * u;
  const bh = bw * 0.62;
  const bx = v ? 60 * u : 100 * u;
  const by = v ? 150 * u : 160 * u;
  const phoneIn = ease(frame, 232, 254);
  return (
    <AbsoluteFill>
      <GlowBg strength={1.2}>
        <Particles n={24} seed="work" size={5} opacity={0.5} />
      </GlowBg>
      <div style={{ position: "absolute", left: bx, top: by, transform: `scale(${bw / 1040})`, transformOrigin: "0 0", opacity: ease(frame, 130, 142) }}>
        <Browser w={1040} h={645} url="sharmagarments.in">
          <SiteMock stage={stage} />
        </Browser>
      </div>
      <div style={{ position: "absolute", left: v ? 60 * u : 1040 * u, top: v ? by + bh + 50 * u : 160 * u, transform: `scale(${u * (v ? 0.85 : 1)})`, transformOrigin: "0 0", translate: `0px ${(1 - phoneIn) * 700 * u}px` }}>
        <Phone w={260}>
          <SiteMock stage={3} mobile scroll={interpolate(frame, [260, 390], [0, 240], clamp)} />
        </Phone>
      </div>
      {/* the specialists' work, one by one */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${v ? width / 1080 : u})`, transformOrigin: "0 0" }}>
        {!v ? (
          <>
            <RoleChip at={140} label="Designer: brand identity" style={{ left: 100, top: 84 }} />
            <RoleChip at={175} label="Developer: responsive website" style={{ left: 450, top: 84 }} />
            <RoleChip at={235} label="Works on every phone" style={{ left: 1010, top: 84 }} />
          </>
        ) : (
          <>
            <RoleChip at={140} label="Designer: brand identity" style={{ left: 60, top: 70 }} />
            <RoleChip at={175} label="Developer: website" style={{ left: 560, top: 70 }} />
          </>
        )}
      </div>
      {/* search, social and ads cards */}
      {[
        { at: 265, title: "SEO", body: "Sharma Garments · Clothing store · Open now", sub: "sharmagarments.in", color: C.mintInk },
        { at: 295, title: "Social media", body: "New festive collection is here ✨", sub: "sharmagarments · ♥ liked by your neighbours", color: "#C2185B" },
        { at: 320, title: "Google Ads", body: "Clothing for every occasion · Visit today", sub: "Sponsored · sharmagarments.in", color: C.cobaltDeep },
      ].map((c, i) => {
        const p = spring({ frame: frame - c.at, fps: 30, config: { damping: 14, stiffness: 140 } });
        const pos = v ? { left: 311 * u, top: by + bh + 50 * u + i * 175 * u, width: width - 371 * u } : { left: 1240 * u + (i % 2) * 0, top: (200 + i * 0) * u, width: 600 * u };
        const lx = v ? pos.left : (1180 + (i === 1 ? 70 : 0)) * u;
        const ly = v ? pos.top : (690 + i * 0) * u;
        return (
          <div
            key={c.title}
            style={{
              position: "absolute",
              left: v ? lx : 1340 * u,
              top: v ? ly : (160 + i * 190) * u,
              width: v ? pos.width : 500 * u,
              padding: `${18 * u}px ${24 * u}px`,
              borderRadius: 18 * u,
              background: "#fff",
              boxShadow: "0 24px 50px -20px rgba(48,80,240,0.45)",
              opacity: frame >= c.at ? 1 : 0,
              scale: String(interpolate(p, [0, 1], [0.7, 1])),
              translate: `0px ${(1 - p) * 40 * u}px`,
              zIndex: 5 + i,
            }}
          >
            <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 18 * u, color: c.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.title}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26 * u, color: C.ink, marginTop: 6 * u }}>{c.body}</div>
            <div style={{ fontFamily: BODY, fontSize: 19 * u, color: C.ink3, marginTop: 4 * u }}>{c.sub}</div>
          </div>
        );
      })}
      <Captions scene="work" />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 10], [1, 0], clamp), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/* ── 6. Two models ──────────────────────────────────────────────────── */
const Flow: React.FC<{ nodes: string[]; at: number; bright?: boolean; y: number; u: number; width: number; v: boolean }> = ({ nodes, at, bright, y, u, width, v }) => {
  const frame = useCurrentFrame();
  const n = nodes.length;
  const pad = (v ? 50 : 160) * u;
  const nw = Math.min((v ? 236 : 340) * u, (width - pad * 2 - (n - 1) * 30 * u) / n);
  const span = width - pad * 2 - nw;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: pad + nw / 2,
          top: y - 2 * u,
          width: span * ease(frame, at, at + 40),
          height: 4 * u,
          background: bright ? `linear-gradient(90deg, ${C.cobalt}, ${G.cyan}, ${G.violet})` : "repeating-linear-gradient(90deg, #6A7390 0 12px, transparent 12px 22px)",
          boxShadow: bright ? `0 0 ${24 * u}px rgba(30,200,240,0.6)` : "none",
        }}
      />
      {nodes.map((t, i) => {
        const x = pad + (n === 1 ? 0 : (span * i) / (n - 1));
        const p = spring({ frame: frame - (at + i * 10), fps: 30, config: { damping: 13, stiffness: 150 } });
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: x,
              top: y - 50 * u,
              width: nw,
              height: 100 * u,
              borderRadius: 22 * u,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: `0 ${10 * u}px`,
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: (v ? 25 : 30) * u,
              lineHeight: 1.15,
              color: bright ? "#fff" : "#C9D0E0",
              background: bright ? `linear-gradient(120deg, ${C.cobalt}, ${G.violet})` : "#1B2240",
              boxShadow: bright ? `0 18px 44px -14px rgba(123,92,255,0.7)` : `inset 0 0 0 ${2 * u}px rgba(160,176,214,0.2)`,
              scale: String(interpolate(p, [0, 1], [0.6, 1])),
              opacity: frame >= at + i * 10 ? 1 : 0,
            }}
          >
            {t}
          </div>
        );
      })}
    </>
  );
};

export const Compare: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const { u, v, width, height } = useLayout();
  const split = height * 0.5;
  const head = ease(frame, 170, 186);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: split, overflow: "hidden" }}>
        <NightBg>
          <div style={{ position: "absolute", left: (v ? 50 : 160) * u, top: (v ? 170 : 70) * u, fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 58 : 56) * u, color: "#C9D0E0", letterSpacing: "-0.02em", opacity: ease(frame, 8, 20) }}>
            Traditional agency overhead
          </div>
          <Flow nodes={["Client", "Account management", "Agency operations", "Delivery team"]} at={16} y={split * (v ? 0.66 : 0.6)} u={u} width={width} v={v} />
        </NightBg>
      </div>
      <div style={{ position: "absolute", left: 0, top: split, width, height: height - split, overflow: "hidden" }}>
        <GlowBg strength={1.4}>
          <div style={{ position: "absolute", left: (v ? 50 : 160) * u, right: 50 * u, top: (v ? 60 : 60) * u, fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 58 : 56) * u, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.05, opacity: ease(frame, 100, 112) }}>
            Direct access to <span style={glowText()}>the people building your product</span>
          </div>
          <Flow nodes={["Client", "Skilled engineers", "Digital solutions"]} at={110} bright y={(height - split) * (v ? 0.5 : 0.52)} u={u} width={width} v={v} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: (v ? 140 : 60) * u,
              textAlign: "center",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: (v ? 76 : 72) * u,
              letterSpacing: "-0.035em",
              color: C.ink,
              opacity: head,
              translate: `0px ${(1 - head) * 30 * u}px`,
            }}
          >
            <span style={glowText()}>Premium quality.</span> Minimum price.
          </div>
        </GlowBg>
      </div>
      <div style={{ position: "absolute", left: 0, top: split - 2 * u, width, height: 4 * u, background: `linear-gradient(90deg, ${G.cyan}, #fff, ${G.violet})`, boxShadow: `0 0 ${40 * u}px ${G.cyan}` }} />
    </AbsoluteFill>
  );
};

/* ── 7. The transformation ──────────────────────────────────────────── */
const Sunbeams: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, mixBlendMode: "screen", pointerEvents: "none" }}>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M1660,170 L${300 + i * 180},1080 L${420 + i * 180},1080 Z`} fill="#FFD9A0" opacity={0.08 + 0.04 * Math.sin(frame / 30 + i)} />
      ))}
    </svg>
  );
};

export const Transform: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { u, v, width, height } = useLayout();
  const insert = frame >= 96 && frame < 200;
  let e: Expr;
  if (frame < 96) e = blend(EXPR.content, EXPR.amazed, ease(frame, 10, 40));
  else if (frame < 260) e = blend(EXPR.amazed, EXPR.smile, ease(frame, 200, 236));
  else e = blend(EXPR.smile, EXPR.joy, ease(frame, 260, 290));
  if (frame > 300) e = { ...e, open: 0.5 + Math.abs(Math.sin(frame / 4)) * 0.4 };
  const pose = frame >= 236 ? "heart" : frame < 96 ? "type" : "rest";
  if (insert) {
    const phoneIn = ease(frame, 130, 152);
    const toast = spring({ frame: frame - 178, fps: 30, config: { damping: 13, stiffness: 150 } });
    const sw = v ? width * 0.94 : width * 0.74;
    const sh = sw * 0.62;
    return (
      <AbsoluteFill style={{ background: "#2A2016", justifyContent: "center", alignItems: "center" }}>
        <Grade warm={0.6}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: v ? "center" : "center", background: "radial-gradient(80% 80% at 70% 30%, #6B4A2A, #2A2016)" }}>
            <div style={{ width: sw, height: sh, borderRadius: 24 * u, background: "#0E1018", padding: 16 * u, translate: v ? `0px ${-260 * u}px` : `${-140 * u}px 0px`, scale: String(interpolate(frame, [96, 200], [1, 1.04])) }}>
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 10 * u, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 1040, height: 1040 * (sh / sw), transform: `scale(${(sw - 32 * u) / 1040})`, transformOrigin: "0 0" }}>
                  <SiteMock stage={3} scroll={interpolate(frame, [110, 200], [0, 160], clamp)} />
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", right: v ? (width - 300 * u) / 2 : 170 * u, top: v ? height * 0.5 : height * 0.2, transform: `scale(${u * (v ? 1.15 : 1)})`, transformOrigin: "0 0", translate: `0px ${(1 - phoneIn) * 900 * u}px` }}>
              <Phone w={260}>
                <SiteMock stage={3} mobile />
              </Phone>
            </div>
            <div
              style={{
                position: "absolute",
                left: v ? 60 * u : undefined,
                right: v ? 60 * u : 120 * u,
                top: v ? 150 * u : 70 * u,
                padding: `${18 * u}px ${24 * u}px`,
                borderRadius: 20 * u,
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 24px 60px -20px rgba(0,0,0,0.5)",
                display: "flex",
                gap: 16 * u,
                alignItems: "center",
                opacity: frame >= 178 ? 1 : 0,
                scale: String(interpolate(toast, [0, 1], [0.7, 1])),
                maxWidth: v ? undefined : 640 * u,
              }}
            >
              <span style={{ width: 56 * u, height: 56 * u, borderRadius: "50%", background: "#2E9E6B", color: "#fff", display: "grid", placeItems: "center", fontFamily: BODY, fontWeight: 800, fontSize: 26 * u, flexShrink: 0 }}>✉</span>
              <span>
                <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 24 * u, color: C.ink }}>New enquiry from the website</div>
                <div style={{ fontFamily: BODY, fontSize: 21 * u, color: C.ink2 }}>"Do you have this kurta in size M?"</div>
              </span>
            </div>
          </AbsoluteFill>
        </Grade>
        <Captions scene="transform" />
      </AbsoluteFill>
    );
  }
  const call = ease(frame, 290, 312);
  return (
    <FadeIn frames={frame < 10 ? 10 : 1} color="#2A2016">
      <Grade warm={0.85}>
        <Set
          w={width}
          h={height}
          zoom={frame < 96 ? interpolate(frame, [0, 96], [1.08, 1.2]) : interpolate(frame, [200, duration], [1.15, 1.38])}
          originY={440}
          focusY={0.45}
        >
          <Shop light={1} />
          <OwnerInShop e={e} pose={pose} />
          <LaptopBack x={frame >= 200 ? 1090 : 810} y={590} open={1} glow="#FFE3A8" />
          <Counter />
          <Sunbeams />
        </Set>
      </Grade>
      {/* the engineers celebrate with him on a call */}
      <div
        style={{
          position: "absolute",
          right: (v ? 40 : 60) * u,
          left: v ? 40 * u : undefined,
          top: (v ? 140 : 60) * u,
          width: v ? undefined : 560 * u,
          height: (v ? 300 : 320) * u,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8 * u,
          padding: 8 * u,
          borderRadius: 22 * u,
          background: "rgba(15,20,38,0.85)",
          boxShadow: `0 0 ${50 * u}px rgba(255,200,120,0.35)`,
          opacity: call,
          translate: `0px ${(1 - call) * -40 * u}px`,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "relative", borderRadius: 14 * u, overflow: "hidden" }}>
            <EngineerPanel i={i} w={(v ? 492 : 268) * u} h={(v ? 138 : 148) * u} screen={false} label={false} e={{ ...EXPR.warm, open: 0.3 + Math.abs(Math.sin((frame + i * 7) / 5)) * 0.4 }} />
          </div>
        ))}
      </div>
      <Captions scene="transform" />
    </FadeIn>
  );
};

/* ── 8. Ending ──────────────────────────────────────────────────────── */
export const Ending: React.FC<P> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, v } = useLayout();
  const logo = spring({ frame: frame - 10, fps, config: { damping: 9, stiffness: 140, mass: 0.7 } });
  const enter = (at: number) => ({ opacity: ease(frame, at, at + 14), translate: `0px ${(1 - ease(frame, at, at + 14)) * 24 * u}px` });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.cobaltDeep} 0%, ${C.cobalt} 45%, ${G.violet} 100%)` }}>
      <AbsoluteFill style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(30,200,240,0.35), transparent 70%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(40% 40% at 50% 85%, rgba(255,200,61,0.25), transparent 70%)" }} />
      <Particles n={60} seed="ending" colors={["#ffffff", G.cyan, "#FFD66B"]} size={5} opacity={0.6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: `0 ${60 * u}px`, scale: String(interpolate(frame, [0, duration], [1, 1.05])) }}>
        <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: (v ? 30 : 44) * u }}>
          <HiMark size={(v ? 220 : 180) * u} style={{ scale: String(interpolate(logo, [0, 1], [0.2, 1])), rotate: `${interpolate(logo, [0, 1], [-18, 0])}deg`, filter: `drop-shadow(0 0 ${50 * u}px rgba(255,200,61,0.55))` }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: (v ? 140 : 150) * u, letterSpacing: "-0.055em", lineHeight: 1, color: "#fff", ...enter(16) }}>
            <span style={{ color: C.marigold }}>Hi</span>Brands
          </div>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 66 : 64) * u, letterSpacing: "-0.03em", color: "#fff", marginTop: 50 * u, lineHeight: 1.1, ...enter(34) }}>
          Your business has potential.
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 760, fontSize: (v ? 66 : 64) * u, letterSpacing: "-0.03em", color: C.marigold, lineHeight: 1.1, ...enter(70) }}>
          Let's build what's next.
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 650, fontSize: (v ? 36 : 32) * u, color: "rgba(255,255,255,0.9)", marginTop: 40 * u, ...enter(110) }}>
          Engineers, not an agency. Premium quality. Minimum price.
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: (v ? 34 : 30) * u, color: "rgba(255,255,255,0.8)", marginTop: 14 * u, ...enter(126) }}>
          hibrands.in · +91 90649 90515
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { mix };
