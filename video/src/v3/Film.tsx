import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Barrier, Birth, Compare, Dream, Ending, Realize, Transform, Work } from "./scenes";
import timeline from "./timeline.json";

export const TL3 = timeline;
const S = timeline.scenes;

/* HiBrands brand film: a shop owner's dream, the barrier, the engineers who
   came together, and the day his business finally went online.
   Timing, captions and sound cues: ./timeline.json (audio/brandfilm_timeline.py). */
export const BrandFilm: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence name="1 A dream" from={S.dream.from} durationInFrames={S.dream.duration}>
      <Dream duration={S.dream.duration} />
    </Sequence>
    <Sequence name="2 The barrier" from={S.barrier.from} durationInFrames={S.barrier.duration}>
      <Barrier duration={S.barrier.duration} />
    </Sequence>
    <Sequence name="3 The realization" from={S.realize.from} durationInFrames={S.realize.duration}>
      <Realize duration={S.realize.duration} />
    </Sequence>
    <Sequence name="4 HiBrands is born" from={S.birth.from} durationInFrames={S.birth.duration}>
      <Birth duration={S.birth.duration} />
    </Sequence>
    <Sequence name="5 The work" from={S.work.from} durationInFrames={S.work.duration}>
      <Work duration={S.work.duration} />
    </Sequence>
    <Sequence name="6 Two models" from={S.compare.from} durationInFrames={S.compare.duration}>
      <Compare duration={S.compare.duration} />
    </Sequence>
    <Sequence name="7 The transformation" from={S.transform.from} durationInFrames={S.transform.duration}>
      <Transform duration={S.transform.duration} />
    </Sequence>
    <Sequence name="8 Ending" from={S.ending.from} durationInFrames={S.ending.duration}>
      <Ending duration={S.ending.duration} />
    </Sequence>
    <Audio name="Soundtrack" src={staticFile("audio/brandfilm.wav")} />
  </AbsoluteFill>
);
