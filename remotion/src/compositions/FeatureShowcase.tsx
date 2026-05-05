import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

interface FeatureShowcaseProps {
  appName: string;
  accentColor: string;
}

const features = [
  { icon: "🔧", title: "Job Management", color: "#f97316" },
  { icon: "👥", title: "Customer CRM", color: "#3b82f6" },
  { icon: "📅", title: "Work Calendar", color: "#22c55e" },
  { icon: "📦", title: "Supplier Hub", color: "#a855f7" },
  { icon: "📊", title: "Reports & Insights", color: "#ec4899" },
];

const SCENE_DURATION = 80;

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  color: string;
}> = ({ icon, title, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 }, from: 0.5, to: 1 });
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {/* Glow circle */}
      <div
        style={{
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <span style={{ fontSize: 100 }}>{icon}</span>
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: 52,
          fontWeight: 700,
          fontFamily: "sans-serif",
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        {title}
      </div>

      {/* Accent bar */}
      <div
        style={{
          width: interpolate(frame, [10, 40], [0, 200]),
          height: 6,
          borderRadius: 3,
          background: color,
        }}
      />
    </AbsoluteFill>
  );
};

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  appName,
  accentColor,
}) => {
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {features.map((f, i) => (
        <Sequence
          key={f.title}
          from={i * SCENE_DURATION}
          durationInFrames={SCENE_DURATION}
        >
          <FeatureCard {...f} />
        </Sequence>
      ))}

      {/* App name watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          color: accentColor,
          fontSize: 28,
          fontFamily: "sans-serif",
          fontWeight: 600,
          letterSpacing: 2,
          opacity: 0.8,
        }}
      >
        {appName.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};
