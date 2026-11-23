import React from "react";
import { AbsoluteFill } from "remotion";
import { HiMark } from "../components";
import { C } from "../theme";
import { G } from "./kit";

/* YouTube profile picture, 800×800 (shown as a circle; the mark stays well inside it) */
export const Profile: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.cobaltDeep} 0%, ${C.cobalt} 50%, ${G.violet} 100%)`, justifyContent: "center", alignItems: "center" }}>
    <AbsoluteFill style={{ background: "radial-gradient(42% 42% at 50% 50%, rgba(255,200,61,0.45), transparent 75%)" }} />
    <HiMark size={470} style={{ position: "relative", translate: "6px -6px", filter: "drop-shadow(0 22px 36px rgba(10,15,60,0.45))" }} />
  </AbsoluteFill>
);
