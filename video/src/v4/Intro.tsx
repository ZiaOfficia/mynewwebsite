import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { K, TL4 } from "./fx";
import { Engineers, Final, Lifeline, Premium, Reveal, Shift, Struggle } from "./scenes";

const S = TL4.scenes;

/* HiBrands intro film for the website hero (45.6 s). See hibrands-brand-film/STORYBOARD.md.
   Timing, lines and sound cues: ./timeline.json (audio/intro_timeline.py). */
export const Intro: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: K.midnight }}>
    <Sequence name="1 Struggle" from={S.struggle.from} durationInFrames={S.struggle.duration}>
      <Struggle duration={S.struggle.duration} />
    </Sequence>
    <Sequence name="2 The world changes" from={S.shift.from} durationInFrames={S.shift.duration}>
      <Shift duration={S.shift.duration} />
    </Sequence>
    <Sequence name="3 HiBrands reveal" from={S.reveal.from} durationInFrames={S.reveal.duration}>
      <Reveal duration={S.reveal.duration} />
    </Sequence>
    <Sequence name="4 Engineers" from={S.engineers.from} durationInFrames={S.engineers.duration}>
      <Engineers duration={S.engineers.duration} />
    </Sequence>
    <Sequence name="5 Premium, local" from={S.premium.from} durationInFrames={S.premium.duration}>
      <Premium duration={S.premium.duration} />
    </Sequence>
    <Sequence name="6 Lifeline" from={S.lifeline.from} durationInFrames={S.lifeline.duration}>
      <Lifeline duration={S.lifeline.duration} />
    </Sequence>
    <Sequence name="7 Brand statement" from={S.final.from} durationInFrames={S.final.duration}>
      <Final duration={S.final.duration} />
    </Sequence>
    {withAudio ? <Audio name="Score" src={staticFile("audio/intro.wav")} /> : null}
  </AbsoluteFill>
);
