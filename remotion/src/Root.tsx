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
          appName: "HardhatHQ",
          tagline: "Ditch the Paperwork.",
          tagline2: "Get Back to the Work That Pays.",
          accentColor: "#06b6d4",
          secondaryColor: "#a855f7",
          features: [
            {
              title: "Manage Jobs",
              description:
                "Track every job from enquiry to completion — with budgets, invoices, timesheets and notes all in one place.",
              icon: "🔧",
            },
            {
              title: "Instant Quotes",
              description:
                "Quote jobs in minutes and send branded PDF quotes directly to your customers.",
              icon: "📋",
            },
            {
              title: "Track Every Cost",
              description:
                "Know exactly where your profit goes with live budget tracking, payments and running totals.",
              icon: "💰",
            },
            {
              title: "Timesheet & Earnings",
              description:
                "Log time across jobs, track weekly earnings and never lose a billable hour again.",
              icon: "⏱️",
            },
          ],
        }}
      />

      {/* Short 15-second feature reel — square for social */}
      <Composition
        id="FeatureShowcase"
        component={FeatureShowcase}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          appName: "HardhatHQ",
          accentColor: "#06b6d4",
          secondaryColor: "#a855f7",
        }}
      />
    </>
  );
};
