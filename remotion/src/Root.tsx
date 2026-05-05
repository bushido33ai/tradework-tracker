import React from "react";
import { Composition } from "remotion";
import { PromoVideo, promoVideoSchema } from "./compositions/PromoVideo";
import { FeatureShowcase } from "./compositions/FeatureShowcase";

export const Root: React.FC = () => {
  return (
    <>
      {/* Main 30-second promo — 1080p landscape */}
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        schema={promoVideoSchema}
        defaultProps={{
          appName: "TradeWork Tracker",
          tagline: "Run your trade business smarter",
          accentColor: "#f97316",
          features: [
            {
              title: "Manage Jobs",
              description: "Track every job from enquiry to completion",
              icon: "🔧",
            },
            {
              title: "Customer CRM",
              description: "Keep all client details in one place",
              icon: "👥",
            },
            {
              title: "Work Calendar",
              description: "Schedule and visualise your workload",
              icon: "📅",
            },
            {
              title: "Supplier Hub",
              description: "Manage suppliers and materials effortlessly",
              icon: "📦",
            },
          ],
        }}
      />

      {/* Short 15-second feature reel — square format for social */}
      <Composition
        id="FeatureShowcase"
        component={FeatureShowcase}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          appName: "TradeWork Tracker",
          accentColor: "#f97316",
        }}
      />
    </>
  );
};
