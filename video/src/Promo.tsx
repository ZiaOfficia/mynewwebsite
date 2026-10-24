import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { C, TL } from "./theme";
import { Bill, Chain, Intro, Question } from "./scenes/Story";
import { AdsVisual, LandingVisual, SeoVisual, ServiceScene, SocialVisual, WebVisual } from "./scenes/Services";
import { Cta, Promises, Tour, Work } from "./scenes/Proof";

const S = TL.scenes;

/* The whole film. Scene timing lives in timeline.json, which the
   soundtrack generator (audio/make_music.py) reads too. */
export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Sequence name="Intro" from={S.intro.from} durationInFrames={S.intro.duration}>
      <Intro duration={S.intro.duration} />
    </Sequence>
    <Sequence name="Question" from={S.question.from} durationInFrames={S.question.duration}>
      <Question duration={S.question.duration} />
    </Sequence>
    <Sequence name="Agency bill" from={S.bill.from} durationInFrames={S.bill.duration}>
      <Bill duration={S.bill.duration} />
    </Sequence>
    <Sequence name="Fewer people in the middle" from={S.chain.from} durationInFrames={S.chain.duration}>
      <Chain duration={S.chain.duration} />
    </Sequence>
    <Sequence name="Websites" from={S.web.from} durationInFrames={S.web.duration}>
      <ServiceScene duration={S.web.duration} index={1} name="Websites" line="Fast, mobile-first sites that bring in enquiries." price="From ₹9,999" visual={WebVisual} />
    </Sequence>
    <Sequence name="Landing pages" from={S.landing.from} durationInFrames={S.landing.duration}>
      <ServiceScene duration={S.landing.duration} index={2} name="Landing pages" line="One page, one goal. Ad clicks become leads." price="From ₹3,999" visual={LandingVisual} />
    </Sequence>
    <Sequence name="SEO" from={S.seo.from} durationInFrames={S.seo.duration}>
      <ServiceScene duration={S.seo.duration} index={3} name="SEO" line="Move up Google, and stay there." price="From ₹4,999 a month" visual={SeoVisual} />
    </Sequence>
    <Sequence name="Social media" from={S.social.from} durationInFrames={S.social.duration}>
      <ServiceScene duration={S.social.duration} index={4} name="Social media" line="Posts and reels that turn followers into customers." price="From ₹15,000 a month" visual={SocialVisual} />
    </Sequence>
    <Sequence name="Google Ads" from={S.ads.from} durationInFrames={S.ads.duration}>
      <ServiceScene duration={S.ads.duration} index={5} name="Google Ads" line="Campaigns where you see exactly where every rupee went." price="From ₹15,000 a month" visual={AdsVisual} />
    </Sequence>
    <Sequence name="Real work" from={S.work.from} durationInFrames={S.work.duration}>
      <Work duration={S.work.duration} />
    </Sequence>
    <Sequence name="Website tour" from={S.tour.from} durationInFrames={S.tour.duration}>
      <Tour duration={S.tour.duration} />
    </Sequence>
    <Sequence name="Promises" from={S.promises.from} durationInFrames={S.promises.duration}>
      <Promises duration={S.promises.duration} />
    </Sequence>
    <Sequence name="Call to action" from={S.cta.from} durationInFrames={S.cta.duration}>
      <Cta duration={S.cta.duration} />
    </Sequence>
    <Audio name="Soundtrack" src={staticFile("audio/soundtrack.wav")} />
  </AbsoluteFill>
);
