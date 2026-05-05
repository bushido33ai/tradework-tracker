import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeatureSceneProps {
  feature: Feature;
  accentColor: string;
  index: number;
}

const MOCK_ITEMS = [
  ["Job #1042 — Kitchen refit", "In Progress", "#f97316"],
  ["Job #1041 — Boiler service", "Complete", "#22c55e"],
  ["Job #1040 — Bathroom tiles", "Scheduled", "#3b82f6"],
  ["Job #1039 — Roof repair", "Pending", "#a855f7"],
];

const MockCard: React.FC<{ delay: number; row: string[] }> = ({
  delay,
  row,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1]);
  const x = interpolate(frame, [delay, delay + 25], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        background: "#1e1e1e",
        borderRadius: 12,
        padding: "18px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderLeft: `4px solid ${row[2]}`,
      }}
    >
      <span style={{ color: "#e0e0e0", fontSize: 22, fontFamily: "monospace" }}>
        {row[0]}
      </span>
      <span
        style={{
          color: row[2],
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "sans-serif",
          background: `${row[2]}22`,
          padding: "4px 16px",
          borderRadius: 20,
        }}
      >
        {row[1]}
      </span>
    </div>
  );
};

export const FeatureScene: React.FC<FeatureSceneProps> = ({
  feature,
  accentColor,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 12 }, from: 0, to: 1 });
  const titleOpacity = interpolate(frame, [15, 40], [0, 1]);
  const titleY = interpolate(frame, [15, 40], [20, 0]);
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
        background: "#111",
        display: "flex",
        alignItems: "center",
        padding: "0 120px",
        gap: 80,
      }}
    >
      {/* Left: Icon + text */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            fontSize: 96,
            transform: `scale(${iconScale})`,
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          {feature.icon}
        </span>

        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              fontFamily: "system-ui, sans-serif",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            {feature.title}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              color: "#888",
              fontFamily: "sans-serif",
              lineHeight: 1.5,
              maxWidth: 480,
            }}
          >
            {feature.description}
          </div>
          <div
            style={{
              marginTop: 32,
              width: interpolate(frame, [40, 90], [0, 140]),
              height: 5,
              borderRadius: 3,
              background: accentColor,
            }}
          />
        </div>
      </div>

      {/* Right: Mock UI card */}
      <div
        style={{
          flex: 1,
          background: "#161616",
          borderRadius: 20,
          padding: 32,
          border: "1px solid #2a2a2a",
          boxShadow: `0 0 60px ${accentColor}22`,
        }}
      >
        <div
          style={{
            color: "#666",
            fontSize: 18,
            fontFamily: "monospace",
            marginBottom: 24,
            letterSpacing: 1,
          }}
        >
          RECENT {feature.title.toUpperCase()}
        </div>
        {MOCK_ITEMS.map((row, i) => (
          <MockCard key={i} delay={20 + i * 12} row={row} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
