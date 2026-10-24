import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { C } from "../theme";
import { AdsVisual, LandingVisual, SeoVisual, SocialVisual, WebVisual } from "../scenes/Services";
import { Promises, Work } from "../scenes/Proof";
import { AgencyOffice, Layers, Question, Transition } from "./Dark";
import { Direct, Quality, Reveal, Service } from "./Bright";
import { Compare, Final, Why } from "./Value";
import timeline from "./timeline.json";

export const TL2 = timeline;
const S = timeline.scenes;

const SERVICES = [
  { key: "web", name: "Websites", line: "Fast, mobile-first sites that bring in enquiries.", tag: "Hand-built and tested on every screen", visual: WebVisual },
  { key: "landing", name: "Landing pages", line: "One page, one goal. Ad clicks become leads.", tag: "Designed to convert, built to load fast", visual: LandingVisual },
  { key: "seo", name: "SEO", line: "Move up Google, and stay there.", tag: "Technical SEO done by engineers", visual: SeoVisual },
  { key: "social", name: "Social media", line: "Posts and reels that turn followers into customers.", tag: "Planned, designed and reported clearly", visual: SocialVisual },
  { key: "ads", name: "Google Ads", line: "Campaigns where you see exactly where every rupee went.", tag: "Every rupee tracked and reported", visual: AdsVisual },
] as const;

/* "Engineers, not an agency": the agency model in the dark, then ours in
   the light. Timing lives in ./timeline.json (built by audio/engineers_timeline.py),
   which the soundtrack generator reads too. No prices appear anywhere. */
export const Engineers: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Sequence name="Agency model" from={S.office.from} durationInFrames={S.office.duration}>
      <AgencyOffice duration={S.office.duration} />
    </Sequence>
    <Sequence name="More layers" from={S.layers.from} durationInFrames={S.layers.duration}>
      <Layers duration={S.layers.duration} />
    </Sequence>
    <Sequence name="What if" from={S.question.from} durationInFrames={S.question.duration}>
      <Question duration={S.question.duration} />
    </Sequence>
    <Sequence name="Light streak" from={S.transition.from} durationInFrames={S.transition.duration}>
      <Transition duration={S.transition.duration} />
    </Sequence>
    <Sequence name="Reveal" from={S.reveal.from} durationInFrames={S.reveal.duration}>
      <Reveal duration={S.reveal.duration} />
    </Sequence>
    <Sequence name="Direct access" from={S.direct.from} durationInFrames={S.direct.duration}>
      <Direct duration={S.direct.duration} />
    </Sequence>
    {SERVICES.map((s, i) => (
      <Sequence key={s.key} name={s.name} from={S[s.key].from} durationInFrames={S[s.key].duration}>
        <Service duration={S[s.key].duration} index={i + 1} name={s.name} line={s.line} tag={s.tag} visual={s.visual} />
      </Sequence>
    ))}
    <Sequence name="Quality" from={S.quality.from} durationInFrames={S.quality.duration}>
      <Quality duration={S.quality.duration} />
    </Sequence>
    <Sequence name="Side by side" from={S.compare.from} durationInFrames={S.compare.duration}>
      <Compare duration={S.compare.duration} />
    </Sequence>
    <Sequence name="Why better value" from={S.why.from} durationInFrames={S.why.duration}>
      <Why duration={S.why.duration} />
    </Sequence>
    <Sequence name="Real work" from={S.work.from} durationInFrames={S.work.duration}>
      <Work duration={S.work.duration} />
    </Sequence>
    <Sequence name="Promises" from={S.promises.from} durationInFrames={S.promises.duration}>
      <Promises duration={S.promises.duration} />
    </Sequence>
    <Sequence name="Final" from={S.final.from} durationInFrames={S.final.duration}>
      <Final duration={S.final.duration} />
    </Sequence>
    <Audio name="Soundtrack" src={staticFile("audio/engineers.wav")} />
  </AbsoluteFill>
);
