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
  accentColor: z.string(),
  features: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
});

type PromoVideoProps = z.infer<typeof promoVideoSchema>;

// Scene timings (frames at 30fps)
// Hero:     0   – 210  (7s)
// Feature1: 210 – 390  (6s)
// Feature2: 390 – 570  (6s)
// Stats:    570 – 720  (5s)
// CTA:      720 – 900  (6s)

export const PromoVideo: React.FC<PromoVideoProps> = ({
  appName,
  tagline,
  accentColor,
  features,
}) => {
  return (
    <AbsoluteFill style={{ background: "#0f0f0f" }}>
      <Sequence from={0} durationInFrames={210}>
        <HeroScene appName={appName} tagline={tagline} accentColor={accentColor} />
      </Sequence>

      <Sequence from={210} durationInFrames={180}>
        <FeatureScene
          feature={features[0]}
          accentColor={accentColor}
          index={0}
        />
      </Sequence>

      <Sequence from={390} durationInFrames={180}>
        <FeatureScene
          feature={features[1]}
          accentColor={accentColor}
          index={1}
        />
      </Sequence>

      <Sequence from={570} durationInFrames={150}>
        <StatsScene accentColor={accentColor} />
      </Sequence>

      <Sequence from={720} durationInFrames={120}>
        <FeatureScene
          feature={features[2]}
          accentColor={accentColor}
          index={2}
        />
      </Sequence>

      <Sequence from={780} durationInFrames={120}>
        <FeatureScene
          feature={features[3]}
          accentColor={accentColor}
          index={3}
        />
      </Sequence>

      <Sequence from={840} durationInFrames={60}>
        <CtaScene appName={appName} accentColor={accentColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
