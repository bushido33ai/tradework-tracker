import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface StatsSceneProps {
  accentColor: string;
}

const stats = [
  { label: "Jobs Tracked", value: "1,200+", icon: "🔧", color: "#f97316" },
  { label: "Happy Traders", value: "340+", icon: "👷", color: "#3b82f6" },
  { label: "Hours Saved/mo", value: "80+", icon: "⏱️", color: "#22c55e" },
  { label: "Revenue Managed", value: "£2M+", icon: "💰", color: "#a855f7" },
];

const StatCard: React.FC<{
  stat: (typeof stats)[0];
  delay: number;
}> = ({ stat, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12 },
    from: 0.7,
    to: 1,
  });
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        background: "#1a1a1a",
        border: `1px solid ${stat.color}44`,
        borderRadius: 20,
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        flex: 1,
        boxShadow: `0 0 40px ${stat.color}11`,
      }}
    >
      <span style={{ fontSize: 52 }}>{stat.icon}</span>
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          color: stat.color,
          lineHeight: 1,
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#888",
          fontFamily: "sans-serif",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC<StatsSceneProps> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1]);
  const headerY = interpolate(frame, [0, 25], [-30, 0]);
  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        background: "linear-gradient(180deg, #0f0f0f 0%, #0a0a1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        gap: 60,
      }}
    >
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            color: "#fff",
          }}
        >
          Trusted by tradespeople across the UK
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "#666",
            fontFamily: "sans-serif",
          }}
        >
          Real results, real businesses
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, width: "100%" }}>
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} delay={20 + i * 15} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
