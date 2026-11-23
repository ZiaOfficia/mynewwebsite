import React from "react";
import { random, useCurrentFrame } from "remotion";

/* ── Illustrated cast and sets for the HiBrands brand film ─────────────
   Everything is drawn in code, so the businessman looks identical in
   every scene. Sets are designed on a 1920×1080 canvas and cover-cropped
   by <Set>, so one drawing serves both 16:9 and 9:16. */

export const mix = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));

export type Expr = {
  brow: number; // -1 worried … 0 … +1 surprised
  eye: number; // eye openness, 1 normal
  mouth: number; // -1 sad … +1 smile
  open: number; // 0 closed … 1 laughing
  tear: number; // 0 … 1 moist eyes
  blush: number; // 0 … 1
  tilt: number; // head tilt, degrees
  slump: number; // 0 … 1 shoulders drop
  lookX: number; // -1 … 1 pupils
  lookY: number;
};

export const EXPR: Record<string, Expr> = {
  content: { brow: 0, eye: 1, mouth: 0.55, open: 0, tear: 0, blush: 0.15, tilt: 0, slump: 0, lookX: 0, lookY: 0 },
  hopeful: { brow: 0.35, eye: 1.05, mouth: 0.4, open: 0, tear: 0, blush: 0.1, tilt: -3, slump: 0, lookX: 0, lookY: 0.4 },
  worried: { brow: -0.8, eye: 0.95, mouth: -0.35, open: 0, tear: 0, blush: 0, tilt: 2, slump: 0.3, lookX: 0, lookY: 0.5 },
  sad: { brow: -1, eye: 0.6, mouth: -0.8, open: 0, tear: 0.15, blush: 0, tilt: 6, slump: 1, lookX: -0.2, lookY: 0.9 },
  amazed: { brow: 1, eye: 1.3, mouth: 0, open: 0.35, tear: 0, blush: 0.1, tilt: -2, slump: 0, lookX: 0, lookY: 0.4 },
  smile: { brow: 0.3, eye: 1, mouth: 0.8, open: 0, tear: 0.2, blush: 0.4, tilt: -3, slump: 0, lookX: 0, lookY: 0.3 },
  joy: { brow: 0.6, eye: 0.7, mouth: 1, open: 0.8, tear: 0.85, blush: 0.7, tilt: -6, slump: 0, lookX: 0, lookY: 0 },
  focus: { brow: -0.15, eye: 0.95, mouth: 0.1, open: 0, tear: 0, blush: 0, tilt: 0, slump: 0, lookX: 0.6, lookY: 0.2 },
  thinking: { brow: -0.45, eye: 0.9, mouth: -0.1, open: 0, tear: 0, blush: 0, tilt: 4, slump: 0, lookX: 0.7, lookY: -0.2 },
  idea: { brow: 0.7, eye: 1.15, mouth: 0.5, open: 0.15, tear: 0, blush: 0.2, tilt: -3, slump: 0, lookX: 0, lookY: 0 },
  warm: { brow: 0.2, eye: 0.9, mouth: 0.85, open: 0.25, tear: 0, blush: 0.35, tilt: -2, slump: 0, lookX: 0, lookY: 0 },
};

/* Blend two named expressions */
export const blend = (a: Expr, b: Expr, t: number): Expr => {
  const o = {} as Expr;
  (Object.keys(a) as (keyof Expr)[]).forEach((k) => (o[k] = mix(a[k], b[k], t)));
  return o;
};

const blinkAmount = (frame: number, seed: string) => {
  const period = 95 + Math.floor(random(seed) * 40);
  const phase = (frame + Math.floor(random(seed + "p") * period)) % period;
  return phase < 3 ? [0.6, 1, 0.6][phase] : 0;
};

type Look = {
  skin: string;
  skinShade: string;
  hair: string;
  hairStyle: "side" | "short" | "bun" | "long" | "curly";
  shirt: string;
  shirtShade: string;
  moustache?: boolean;
  glasses?: boolean;
  headphones?: boolean;
  collar?: boolean;
};

export const OWNER: Look = {
  skin: "#C68A5C",
  skinShade: "#A8703F",
  hair: "#1F1A1C",
  hairStyle: "side",
  shirt: "#2F7F86",
  shirtShade: "#256870",
  moustache: true,
  collar: true,
};

export const ENGINEERS: Record<string, Look> = {
  dev: { skin: "#B67B52", skinShade: "#99643E", hair: "#231C1C", hairStyle: "short", shirt: "#2B3A67", shirtShade: "#222F55", glasses: true },
  design: { skin: "#D9A07A", skinShade: "#BE8660", hair: "#2B1D18", hairStyle: "bun", shirt: "#E2A23B", shirtShade: "#C88A27" },
  seo: { skin: "#A86F48", skinShade: "#8E5B37", hair: "#1E1716", hairStyle: "long", shirt: "#7B5CFF", shirtShade: "#6548E0", glasses: true },
  ads: { skin: "#C88E66", skinShade: "#AD754E", hair: "#2A201C", hairStyle: "curly", shirt: "#2E9E6B", shirtShade: "#24865A", headphones: true },
};

type Arm = { hand: [number, number]; elbow?: [number, number] };

/* A person from the waist up in a 400×560 box. Hands are placed in that box. */
export const Person: React.FC<{
  look: Look;
  e: Expr;
  left: Arm;
  right: Arm;
  seed?: string;
  breathe?: boolean;
}> = ({ look, e, left, right, seed = "p", breathe = true }) => {
  const frame = useCurrentFrame();
  const blink = blinkAmount(frame, seed);
  const eyeH = Math.max(0.6, 9.5 * e.eye * (1 - blink));
  const br = Math.sin(frame / 22) * (breathe ? 1.6 : 0);
  const worry = Math.max(0, -e.brow);
  const surprise = Math.max(0, e.brow);
  const inner = 156 - 13 * worry - 10 * surprise;
  const outer = 156 + 7 * worry - 8 * surprise;
  const px = e.lookX * 3.2;
  const py = e.lookY * 3;
  const mouthY = 238;
  const s = look;

  const arm = (from: [number, number], a: Arm, side: 1 | -1) => {
    const el = a.elbow ?? [from[0] + side * 34, (from[1] + a.hand[1]) / 2 + 40];
    return (
      <g>
        <path
          d={`M${from[0]},${from[1]} Q${el[0]},${el[1]} ${a.hand[0]},${a.hand[1]}`}
          stroke={s.shirtShade}
          strokeWidth={46}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${from[0]},${from[1]} Q${el[0]},${el[1]} ${a.hand[0]},${a.hand[1]}`}
          stroke={s.shirt}
          strokeWidth={38}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={a.hand[0]} cy={a.hand[1]} r={21} fill={s.skin} />
        <circle cx={a.hand[0] - side * 6} cy={a.hand[1] - 6} r={9} fill={s.skinShade} opacity={0.35} />
      </g>
    );
  };

  const hairBack =
    s.hairStyle === "long" ? (
      <path d="M118,170 C112,250 118,330 140,360 L262,360 C284,330 290,250 282,170 Z" fill={s.hair} />
    ) : s.hairStyle === "bun" ? (
      <circle cx={200} cy={74} r={36} fill={s.hair} />
    ) : null;

  const hairFront = {
    side: "M121,176 C114,108 158,74 206,76 C256,78 288,112 280,178 C274,148 256,128 222,121 C196,117 170,126 150,138 C136,148 126,160 121,176 Z",
    short: "M123,168 C120,108 160,80 204,80 C250,80 284,110 278,168 C268,140 246,124 204,122 C164,122 136,138 123,168 Z",
    bun: "M122,178 C118,112 160,82 204,82 C252,84 284,116 278,178 C266,140 240,124 200,124 C162,124 134,142 122,178 Z",
    long: "M118,190 C112,112 158,78 204,78 C254,80 290,116 282,196 C270,150 238,126 206,124 C174,124 140,140 118,190 Z",
    curly: "M120,176 C108,150 120,104 150,92 C162,72 196,66 214,76 C240,66 270,84 276,106 C296,128 288,160 280,178 C272,150 250,130 204,128 C162,128 134,146 120,176 Z",
  }[s.hairStyle];

  return (
    <svg viewBox="0 0 400 560" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${e.slump * 16 + br})`}>
        {hairBack}
        {/* torso */}
        <path d="M58,560 C58,380 92,300 150,286 L250,286 C308,300 342,380 342,560 Z" fill={s.shirt} />
        <path d="M200,300 L200,560" stroke={s.shirtShade} strokeWidth={4} />
        {s.collar ? (
          <>
            <path d="M160,284 L200,330 L178,346 L150,296 Z" fill={s.shirtShade} />
            <path d="M240,284 L200,330 L222,346 L250,296 Z" fill={s.shirtShade} />
            {[360, 400, 440].map((y) => (
              <circle key={y} cx={207} cy={y} r={4} fill="#E8F2F2" opacity={0.8} />
            ))}
          </>
        ) : (
          <path d="M168,286 Q200,320 232,286" fill="none" stroke={s.shirtShade} strokeWidth={8} />
        )}
        {/* neck */}
        <path d="M176,236 L176,292 Q200,306 224,292 L224,236 Z" fill={s.skinShade} />
        {/* head group tilts */}
        <g transform={`rotate(${e.tilt} 200 270)`}>
          <ellipse cx={125} cy={188} rx={14} ry={19} fill={s.skinShade} />
          <ellipse cx={275} cy={188} rx={14} ry={19} fill={s.skinShade} />
          <ellipse cx={200} cy={180} rx={77} ry={92} fill={s.skin} />
          <path d={hairFront} fill={s.hair} />
          {s.hairStyle === "side" ? <path d="M176,96 C190,90 212,92 226,100" stroke="#3A3234" strokeWidth={3} fill="none" opacity={0.6} /> : null}
          {/* brows */}
          <path d={`M152,${outer} Q170,${(inner + outer) / 2 - 4} 186,${inner}`} stroke={s.hair} strokeWidth={7} strokeLinecap="round" fill="none" />
          <path d={`M248,${outer} Q230,${(inner + outer) / 2 - 4} 214,${inner}`} stroke={s.hair} strokeWidth={7} strokeLinecap="round" fill="none" />
          {/* eyes */}
          {[172, 228].map((x) => (
            <g key={x}>
              <ellipse cx={x + px} cy={184 + py} rx={7.5} ry={eyeH} fill="#1B1414" />
              {eyeH > 3 ? <circle cx={x + px + 2.6} cy={184 + py - 3} r={2.4 + e.tear * 1.4} fill="#fff" opacity={0.9} /> : null}
            </g>
          ))}
          {s.glasses ? (
            <g fill="none" stroke="#2A2A33" strokeWidth={4}>
              <rect x={150} y={168} width={42} height={32} rx={10} />
              <rect x={208} y={168} width={42} height={32} rx={10} />
              <path d="M192,182 L208,182" />
            </g>
          ) : null}
          {/* moist eyes */}
          {e.tear > 0.02 ? (
            <g opacity={e.tear}>
              <ellipse cx={172} cy={196} rx={9} ry={3} fill="#D6F1FF" />
              <ellipse cx={228} cy={196} rx={9} ry={3} fill="#D6F1FF" />
              <path d={`M164,198 q-5,12 0,${16 + e.tear * 8} q5,-4 0,${-16 - e.tear * 8}`} fill="#D6F1FF" opacity={e.tear > 0.55 ? 0.95 : 0} />
            </g>
          ) : null}
          {/* blush */}
          <ellipse cx={158} cy={216} rx={14} ry={8} fill="#E0705A" opacity={e.blush * 0.35} />
          <ellipse cx={242} cy={216} rx={14} ry={8} fill="#E0705A" opacity={e.blush * 0.35} />
          {/* nose */}
          <path d="M200,190 Q210,210 197,214" stroke={s.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
          {s.moustache ? <path d="M174,224 Q200,212 226,224 Q213,232 200,227 Q187,232 174,224 Z" fill={s.hair} /> : null}
          {/* mouth */}
          {e.open > 0.05 ? (
            <path
              d={`M${184 - e.open * 4},${mouthY} Q200,${mouthY - 2 + e.mouth * 2} ${216 + e.open * 4},${mouthY} Q200,${mouthY + 8 + e.open * 20} ${184 - e.open * 4},${mouthY} Z`}
              fill="#6E2B2B"
            />
          ) : (
            <path d={`M${180 - Math.max(0, e.mouth) * 3},${mouthY - Math.max(0, e.mouth) * 3} Q200,${mouthY + e.mouth * 20} ${220 + Math.max(0, e.mouth) * 3},${mouthY - Math.max(0, e.mouth) * 3}`} stroke="#5A2626" strokeWidth={5} strokeLinecap="round" fill="none" />
          )}
          {s.headphones ? (
            <g>
              <path d="M118,176 C118,90 282,90 282,176" stroke="#1E2433" strokeWidth={12} fill="none" />
              <rect x={104} y={162} width={26} height={46} rx={10} fill="#1E2433" />
              <rect x={270} y={162} width={26} height={46} rx={10} fill="#1E2433" />
            </g>
          ) : null}
        </g>
        {arm([132, 312], left, -1)}
        {arm([268, 312], right, 1)}
      </g>
    </svg>
  );
};

/* Cover-scale a 1920×1080 design canvas into any container */
export const Set: React.FC<{ w: number; h: number; children: React.ReactNode; focusY?: number; zoom?: number; originX?: number; originY?: number }> = ({
  w,
  h,
  children,
  focusY = 0.5,
  zoom = 1,
  originX = 960,
  originY = 540,
}) => {
  const s = Math.max(w / 1920, h / 1080) * zoom;
  const left = w / 2 - originX * s;
  const top = h * focusY - originY * s;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};

export const Abs: React.FC<{ x: number; y: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);

/* ── The shop ───────────────────────────────────────────────────────── */
const CLOTH = ["#C0392B", "#E67E22", "#F4D03F", "#2E86C1", "#7D3C98", "#17A589", "#EC7063", "#5D6D7E", "#D35400", "#AF7AC5"];

const Shelf: React.FC<{ x: number; y: number; seed: string }> = ({ x, y, seed }) => (
  <g>
    {[0, 1, 2, 3].map((row) => (
      <g key={row}>
        <rect x={x} y={y + row * 150 + 120} width={330} height={14} fill="#8A5A36" />
        {[0, 1, 2, 3, 4].map((i) => {
          const c = CLOTH[Math.floor(random(`${seed}${row}${i}`) * CLOTH.length)];
          const hgt = 70 + random(`${seed}h${row}${i}`) * 40;
          return (
            <g key={i}>
              <rect x={x + 12 + i * 63} y={y + row * 150 + 120 - hgt} width={56} height={hgt} rx={5} fill={c} />
              {[1, 2, 3].map((k) => (
                <rect key={k} x={x + 12 + i * 63} y={y + row * 150 + 120 - hgt + (k * hgt) / 4} width={56} height={2.5} fill="#000" opacity={0.12} />
              ))}
            </g>
          );
        })}
      </g>
    ))}
    <rect x={x - 10} y={y - 20} width={350} height={630} fill="none" stroke="#7A4E2E" strokeWidth={14} rx={6} />
  </g>
);

export const Shop: React.FC<{ light?: number; street?: boolean }> = ({ light = 0, street = true }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9D9C2" />
          <stop offset="1" stopColor="#D8C2A3" />
        </linearGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9C6A42" />
          <stop offset="1" stopColor="#7A4F2F" />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light > 0.5 ? "#FFD9A0" : "#BFDDF2"} />
          <stop offset="1" stopColor={light > 0.5 ? "#FFF1D6" : "#EAF4FA"} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#wall)" />
      {/* floor */}
      <rect y={900} width={1920} height={180} fill="#B58C64" />
      {/* doorway to the street, right */}
      <g>
        <rect x={1460} y={170} width={400} height={740} fill="url(#sky)" />
        {street ? (
          <g>
            <rect x={1460} y={330} width={180} height={580} fill="#E3B98E" />
            <rect x={1660} y={280} width={200} height={630} fill="#D9A6A0" />
            {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={1490 + c * 70} y={380 + r * 110} width={44} height={60} fill="#8FB7CF" opacity={0.7} />))}
            {[0, 1, 2].map((r) => <rect key={r} x={1700} y={330 + r * 120} width={120} height={70} fill="#9CC3D8" opacity={0.7} />)}
            <rect x={1460} y={830} width={400} height={80} fill="#9E9E9E" />
            {/* passers-by */}
            {[0, 1, 2].map((i) => {
              const sp = 1.6 + i * 0.5;
              const xx = 1440 + (((frame * sp + i * 170) % 520));
              return (
                <g key={i} opacity={0.75}>
                  <circle cx={xx} cy={720 - i * 6} r={16} fill="#5B4A44" />
                  <rect x={xx - 18} y={738 - i * 6} width={36} height={86} rx={14} fill={["#4E6E8E", "#8E5B4E", "#6B8E4E"][i]} />
                </g>
              );
            })}
          </g>
        ) : null}
        <rect x={1446} y={156} width={428} height={760} fill="none" stroke="#7A4E2E" strokeWidth={28} />
      </g>
      {/* shelves left */}
      <Shelf x={70} y={190} seed="L" />
      {/* hanging rack between shelf and door */}
      <g>
        <rect x={1120} y={250} width={300} height={10} rx={5} fill="#6F6F6F" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`rotate(${Math.sin(frame / 40 + i) * 1.2} ${1150 + i * 58} 255)`}>
            <path d={`M${1150 + i * 58},255 l0,18`} stroke="#555" strokeWidth={3} />
            <path d={`M${1124 + i * 58},284 L${1176 + i * 58},284 L${1184 + i * 58},470 L${1116 + i * 58},470 Z`} fill={CLOTH[(i * 3 + 1) % CLOTH.length]} />
            <path d={`M${1124 + i * 58},284 L${1108 + i * 58},340 L${1124 + i * 58},346 Z`} fill={CLOTH[(i * 3 + 1) % CLOTH.length]} />
            <path d={`M${1176 + i * 58},284 L${1192 + i * 58},340 L${1176 + i * 58},346 Z`} fill={CLOTH[(i * 3 + 1) % CLOTH.length]} />
          </g>
        ))}
      </g>
      {/* shop sign */}
      <g>
        <rect x={560} y={70} width={800} height={110} rx={14} fill="#7A2E2E" />
        <rect x={572} y={82} width={776} height={86} rx={10} fill="none" stroke="#E8C77A" strokeWidth={3} />
        <text x={960} y={143} textAnchor="middle" fontFamily="Bricolage" fontWeight={800} fontSize={56} fill="#F4DFA6" letterSpacing={6}>
          SHARMA GARMENTS
        </text>
      </g>
      {/* calendar + small temple shelf for warmth */}
      <g>
        <rect x={500} y={250} width={110} height={140} rx={6} fill="#F7F1E6" />
        <rect x={500} y={250} width={110} height={34} rx={6} fill="#C0392B" />
        {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={512 + c * 24} y={296 + r * 22} width={16} height={12} fill="#BDB2A0" />))}
      </g>
      <g>
        <rect x={1300} y={560} width={120} height={10} fill="#8A5A36" />
        <circle cx={1330} cy={545} r={10} fill="#F39C12" />
        <path d="M1330,520 q8,12 0,20 q-8,-8 0,-20" fill="#F7C04A" opacity={0.6 + 0.4 * Math.abs(Math.sin(frame / 7))} />
        <rect x={1360} y={520} width={40} height={40} rx={4} fill="#E59866" />
      </g>
    </svg>
  );
};

/* The shop counter, drawn in front of the owner */
export const Counter: React.FC = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <rect x={430} y={770} width={1060} height={34} rx={8} fill="#A9744A" />
    <rect x={450} y={804} width={1020} height={300} fill="#8C5D38" />
    <rect x={450} y={804} width={1020} height={300} fill="url(#wood)" opacity={0.6} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={490 + i * 330} y={840} width={290} height={200} rx={10} fill="none" stroke="#6E4527" strokeWidth={6} />
    ))}
    {/* folded stock on the counter */}
    <rect x={480} y={712} width={150} height={30} rx={6} fill="#2E86C1" />
    <rect x={488} y={684} width={140} height={30} rx={6} fill="#F4D03F" />
    <rect x={494} y={656} width={128} height={30} rx={6} fill="#C0392B" />
    <rect x={480} y={742} width={160} height={30} rx={6} fill="#17A589" />
  </svg>
);

/* Laptop seen from behind (lid), sits on the counter */
export const LaptopBack: React.FC<{ x: number; y: number; open: number; glow?: string }> = ({ x, y, open, glow = "#9FC6FF" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300, height: 200 }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: 300,
        height: 190 * open,
        borderRadius: "14px 14px 4px 4px",
        background: "linear-gradient(180deg, #B9BEC9, #9AA0AD)",
        boxShadow: `0 0 ${60 * open}px ${glow}55`,
      }}
    />
    <div style={{ position: "absolute", left: -16, bottom: -8, width: 332, height: 14, borderRadius: 6, background: "#7E8594" }} />
  </div>
);

/* ── Remote workspaces for the engineers ─────────────────────────────── */
export const Workspace: React.FC<{ night?: boolean; tint: string; children?: React.ReactNode }> = ({ night, tint, children }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect width={1920} height={1080} fill={night ? "#1A2140" : "#EEF1F7"} />
        <rect x={120} y={180} width={520} height={460} rx={10} fill={night ? "#0E1530" : "#CFE6F7"} />
        {night ? (
          <g>
            {[...Array(14)].map((_, i) => (
              <circle key={i} cx={150 + random(`s${i}`) * 460} cy={210 + random(`t${i}`) * 300} r={1.5 + random(`r${i}`) * 2} fill="#fff" opacity={0.5 + 0.5 * Math.sin(frame / 9 + i)} />
            ))}
            <circle cx={540} cy={280} r={36} fill="#F6EBC6" opacity={0.9} />
          </g>
        ) : (
          <g>
            <circle cx={520} cy={290} r={60} fill="#FFF3C4" />
            <rect x={160} y={480} width={440} height={160} fill="#BFD8C9" />
          </g>
        )}
        <rect x={120} y={180} width={520} height={460} rx={10} fill="none" stroke={night ? "#2B3560" : "#D6DCE8"} strokeWidth={18} />
        <path d="M380,180 L380,640 M120,410 L640,410" stroke={night ? "#2B3560" : "#D6DCE8"} strokeWidth={10} />
        {/* plant */}
        <rect x={1660} y={660} width={90} height={110} rx={10} fill={tint} opacity={0.9} />
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={1705 + (i - 2) * 26} cy={630 - Math.abs(i - 2) * -14} rx={18} ry={52} fill="#3E8E5E" transform={`rotate(${(i - 2) * 18} ${1705} 680)`} />
        ))}
        {/* desk */}
        <rect y={770} width={1920} height={310} fill={night ? "#2A2F45" : "#C9B49A"} />
        <rect y={770} width={1920} height={18} fill={night ? "#3A4060" : "#B49D81"} />
      </svg>
      {children}
    </>
  );
};

/* A monitor on the desk, screen content as HTML */
export const Monitor: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; night?: boolean }> = ({ x, y, w, h, children, night }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <div style={{ width: w, height: h, borderRadius: 16, background: "#14161E", padding: 12, boxShadow: night ? "0 0 120px rgba(120,160,255,0.35)" : "0 30px 60px -30px rgba(0,0,0,0.4)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 8, overflow: "hidden", background: "#fff", position: "relative" }}>{children}</div>
    </div>
    <div style={{ width: 40, height: 60, margin: "0 auto", background: "#2A2D38" }} />
    <div style={{ width: 200, height: 14, margin: "0 auto", borderRadius: 7, background: "#2A2D38" }} />
  </div>
);
