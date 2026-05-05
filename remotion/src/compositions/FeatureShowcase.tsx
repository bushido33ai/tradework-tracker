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
  secondaryColor: string;
}

const features = [
  { icon: "🔧", title: "Manage Jobs", color: "#06b6d4" },
  { icon: "📋", title: "Instant Quotes", color: "#a855f7" },
  { icon: "💰", title: "Budget Tracking", color: "#22c55e" },
  { icon: "⏱️", title: "Timesheet", color: "#f59e0b" },
  { icon: "👥", title: "Customers & Suppliers", color: "#ec4899" },
];

const SCENE_DURATION = 80;

const FeatureCard: React.FC<{ icon: string; title: string; color: string; appName: string }> = ({
  icon,
  title,
  color,
  appName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 }, from: 0.5, to: 1 });
  const opacity = interpolate(frame, [0, 18], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a0e1a 0%, #0d1117 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
      }} />

      <div style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        border: `3px solid ${color}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        opacity,
        background: `${color}11`,
      }}>
        <span style={{ fontSize: 96 }}>{icon}</span>
      </div>

      <div style={{
        color: "#fff",
        fontSize: 52,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
        transform: `scale(${scale})`,
        opacity,
        textAlign: "center",
        padding: "0 40px",
        lineHeight: 1.2,
      }}>
        {title}
      </div>

      <div style={{
        width: interpolate(frame, [12, 45], [0, 180]),
        height: 5,
        borderRadius: 3,
        background: color,
      }} />

      {/* App name */}
      <div style={{
        position: "absolute",
        bottom: 48,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: interpolate(frame, [20, 40], [0, 0.7]),
      }}>
        <span style={{ fontSize: 24 }}>⛑️</span>
        <span style={{
          fontSize: 26,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          background: `linear-gradient(90deg, #06b6d4, #a855f7)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 1,
        }}>
          {appName}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  appName,
  accentColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill style={{ background: "#0d1117" }}>
      {features.map((f, i) => (
        <Sequence key={f.title} from={i * SCENE_DURATION} durationInFrames={SCENE_DURATION}>
          <FeatureCard {...f} appName={appName} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
