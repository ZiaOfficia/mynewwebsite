import { loadFont } from "@remotion/fonts";
import { Easing, staticFile, useVideoConfig } from "remotion";
import timeline from "./timeline.json";

export const TL = timeline;

/* Brand palette — identical to the website */
export const C = {
  paper: "#EEF3FF",
  paperDeep: "#E1E9FC",
  surface: "#FFFFFF",
  ink: "#18213D",
  ink2: "#4B5675",
  ink3: "#646F8A",
  line: "#D3DCF2",
  cobalt: "#3050F0",
  cobaltDeep: "#2238C4",
  cobaltSoft: "#DCE3FF",
  marigold: "#FFC83D",
  marigoldDeep: "#F2AE00",
  marigoldSoft: "#FFF0C2",
  mint: "#C6EEDB",
  mintSoft: "#E4F7EE",
  mintInk: "#17714A",
};

export const DISPLAY = "Bricolage";
export const BODY = "Geist";

loadFont({ family: DISPLAY, url: staticFile("fonts/bricolage.woff2"), weight: "200 800" });
loadFont({ family: BODY, url: staticFile("fonts/geist.woff2"), weight: "100 900" });

/* House easing: fast out, soft landing */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Layout helper: one design for 16:9 and 9:16.
   `u` scales sizes to the frame; `v` is true for the vertical cut. */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const v = height > width;
  const u = v ? width / 1080 : width / 1920;
  return { v, u, width, height };
};
