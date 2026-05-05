import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { HeroScene } from "../components/HeroScene";
import { FeatureScene } from "../components/FeatureScene";
import { StatsScene } from "../components/StatsScene";
import { CtaScene } from "../components/CtaScene";

export const promoVideoSchema = z.object({
  appName: z.string(),
  tagline: z.string(),
  tagline2: z.string(),
  accentColor: z.string(),
  secondaryColor: z.string(),
  features: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
});

type PromoVideoProps = z.infer<typeof promoVideoSchema>;

// Timeline (frames @ 30fps)
// Hero:       0   – 210  (7s)
// Feature 1:  210 – 390  (6s)
// Feature 2:  390 – 570  (6s)
// Stats:      570 – 720  (5s)
// Feature 3:  720 – 840  (4s)
// Feature 4:  840 – 870  (1s overlap into CTA)
// CTA:        840 – 900  (2s)

export const PromoVideo: React.FC<PromoVideoProps> = ({
  appName,
  tagline,
  tagline2,
  accentColor,
  secondaryColor,
  features,
}) => {
  return (
    <AbsoluteFill style={{ background: "#0d1117" }}>
      <Sequence from={0} durationInFrames={210}>
        <HeroScene
          appName={appName}
          tagline={tagline}
          tagline2={tagline2}
          accentColor={accentColor}
          secondaryColor={secondaryColor}
        />
      </Sequence>

      <Sequence from={210} durationInFrames={180}>
        <FeatureScene feature={features[0]} accentColor={accentColor} secondaryColor={secondaryColor} index={0} />
      </Sequence>

      <Sequence from={390} durationInFrames={180}>
        <FeatureScene feature={features[1]} accentColor={accentColor} secondaryColor={secondaryColor} index={1} />
      </Sequence>

      <Sequence from={570} durationInFrames={150}>
        <StatsScene accentColor={accentColor} secondaryColor={secondaryColor} />
      </Sequence>

      <Sequence from={720} durationInFrames={150}>
        <FeatureScene feature={features[2]} accentColor={accentColor} secondaryColor={secondaryColor} index={2} />
      </Sequence>

      <Sequence from={750} durationInFrames={150}>
        <FeatureScene feature={features[3]} accentColor={accentColor} secondaryColor={secondaryColor} index={3} />
      </Sequence>

      <Sequence from={840} durationInFrames={60}>
        <CtaScene appName={appName} accentColor={accentColor} secondaryColor={secondaryColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
