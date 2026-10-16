import React from "react";
import { Composition, Still } from "remotion";
import { Promo } from "./Promo";
import { TL } from "./theme";
import { Engineers, TL2 } from "./v2/Engineers";
import { ThumbnailA, ThumbnailB } from "./v2/Thumbnail";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HiBrandsPromo" component={Promo} width={1920} height={1080} fps={TL.fps} durationInFrames={TL.durationInFrames} />
    <Composition id="HiBrandsPromoVertical" component={Promo} width={1080} height={1920} fps={TL.fps} durationInFrames={TL.durationInFrames} />
    <Composition id="HiBrandsEngineers" component={Engineers} width={1920} height={1080} fps={TL2.fps} durationInFrames={TL2.durationInFrames} />
    <Composition id="HiBrandsEngineersVertical" component={Engineers} width={1080} height={1920} fps={TL2.fps} durationInFrames={TL2.durationInFrames} />
    <Still id="ThumbnailA" component={ThumbnailA} width={1920} height={1080} />
    <Still id="ThumbnailB" component={ThumbnailB} width={1920} height={1080} />
  </>
);
