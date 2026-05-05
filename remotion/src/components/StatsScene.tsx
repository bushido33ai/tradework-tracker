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
  secondaryColor: string;
}

const stats = [
  { label: "Jobs Tracked", value: "1,200+", icon: "🔧", color: "#06b6d4" },
  { label: "Quotes Sent", value: "3,400+", icon: "📋", color: "#a855f7" },
  { label: "Hours Logged", value: "18,000+", icon: "⏱️", color: "#22c55e" },
  { label: "Revenue Managed", value: "£2M+", icon: "💰", color: "#f59e0b" },
];

const StatCard: React.FC<{ stat: (typeof stats)[0]; delay: number }> = ({
  stat,
  delay,
}) => {
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
    <div style={{
      transform: `scale(${scale})`,
      opacity,
      background: "#0f1623",
      border: `1px solid ${stat.color}33`,
      borderRadius: 20,
      padding: "36px 28px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      flex: 1,
      boxShadow: `0 0 40px ${stat.color}0f`,
    }}>
      <span style={{ fontSize: 48 }}>{stat.icon}</span>
      <div style={{
        fontSize: 58,
        fontWeight: 900,
        fontFamily: "system-ui, sans-serif",
        color: stat.color,
        lineHeight: 1,
      }}>
        {stat.value}
      </div>
      <div style={{
        fontSize: 19,
        color: "#64748b",
        fontFamily: "sans-serif",
        textAlign: "center",
        fontWeight: 500,
      }}>
        {stat.label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC<StatsSceneProps> = ({ accentColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1]);
  const headerY = interpolate(frame, [0, 25], [-28, 0]);
  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: "linear-gradient(160deg, #0a0e1a 0%, #0d1117 60%, #0a0a1f 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 90px",
      gap: 56,
    }}>
      <div style={{
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 50,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
        }}>
          Trusted by tradespeople across the UK
        </div>
        <div style={{
          marginTop: 14,
          fontSize: 24,
          color: "#475569",
          fontFamily: "sans-serif",
        }}>
          Real businesses. Real results.
        </div>
      </div>

      <div style={{ display: "flex", gap: 28, width: "100%" }}>
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} delay={20 + i * 14} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
