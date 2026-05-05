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
  secondaryColor: string;
  index: number;
}

// Mock data per feature index matching the real app screenshots
const MOCK_DATA = [
  // Jobs
  [
    ["Solar panels in Appleton", "current", "#06b6d4"],
    ["Wet Room Installation", "current", "#06b6d4"],
    ["Ground Floor Extension", "current", "#06b6d4"],
    ["Bathroom Installation", "in progress", "#a855f7"],
    ["Kitchen Renovation - Smith Residence", "in progress", "#a855f7"],
  ],
  // Quotes
  [
    ["Quote #0042 — Loft Conversion", "Sent", "#f59e0b"],
    ["Quote #0041 — New Boiler Fit", "Accepted", "#22c55e"],
    ["Quote #0040 — Deck & Patio", "Draft", "#64748b"],
    ["Quote #0039 — Rewire (full)", "Sent", "#f59e0b"],
    ["Quote #0038 — Plastering", "Accepted", "#22c55e"],
  ],
  // Budget
  [
    ["Wet Room Installation", "£6,500 budget · 0% spent", "#22c55e"],
    ["Ground Floor Extension", "£33,000 budget · 12% spent", "#06b6d4"],
    ["Bathroom Installation", "£8,500 budget · 34% spent", "#f59e0b"],
    ["Kitchen Renovation", "£12,500 budget · 61% spent", "#a855f7"],
    ["Solar panels Appleton", "£4,200 budget · 8% spent", "#22c55e"],
  ],
  // Timesheet
  [
    ["Mon 4 May", "Solar panels — 6h", "#06b6d4"],
    ["Tue 5 May", "Bathroom Installation — 8h", "#a855f7"],
    ["Wed 6 May", "Kitchen Renovation — 7.5h", "#f59e0b"],
    ["Thu 7 May", "Wet Room — 8h", "#06b6d4"],
    ["Fri 8 May", "Ground Floor Extension — 5h", "#22c55e"],
  ],
];

const MockRow: React.FC<{ delay: number; row: string[]; accentColor: string }> = ({
  delay,
  row,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [delay, delay + 22], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{
      opacity,
      transform: `translateX(${x}px)`,
      background: "#0d1117",
      borderRadius: 10,
      padding: "14px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      borderLeft: `3px solid ${row[2]}`,
    }}>
      <span style={{ color: "#cbd5e1", fontSize: 20, fontFamily: "sans-serif" }}>
        {row[0]}
      </span>
      <span style={{
        color: row[2],
        fontSize: 17,
        fontWeight: 600,
        fontFamily: "sans-serif",
        background: `${row[2]}22`,
        padding: "3px 14px",
        borderRadius: 20,
        textTransform: "capitalize",
      }}>
        {row[1]}
      </span>
    </div>
  );
};

export const FeatureScene: React.FC<FeatureSceneProps> = ({
  feature,
  accentColor,
  secondaryColor,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 12 }, from: 0, to: 1 });
  const titleOpacity = interpolate(frame, [15, 40], [0, 1]);
  const titleY = interpolate(frame, [15, 40], [20, 0]);
  const dividerWidth = interpolate(frame, [40, 90], [0, 160]);
  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rows = MOCK_DATA[index] ?? MOCK_DATA[0];

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: "linear-gradient(135deg, #0a0e1a 0%, #0d1117 100%)",
      display: "flex",
      alignItems: "center",
      padding: "0 100px",
      gap: 80,
    }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{
          fontSize: 88,
          transform: `scale(${iconScale})`,
          display: "inline-block",
          lineHeight: 1,
          filter: `drop-shadow(0 0 20px ${accentColor}88)`,
        }}>
          {feature.icon}
        </span>

        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div style={{
            fontSize: 60,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            color: "#ffffff",
            lineHeight: 1.1,
          }}>
            {feature.title}
          </div>
          <div style={{
            marginTop: 18,
            fontSize: 26,
            color: "#94a3b8",
            fontFamily: "sans-serif",
            lineHeight: 1.6,
            maxWidth: 460,
          }}>
            {feature.description}
          </div>
          <div style={{
            marginTop: 28,
            width: dividerWidth,
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
          }} />
        </div>
      </div>

      {/* Right panel — mock app UI */}
      <div style={{
        flex: 1,
        background: "#0f1623",
        borderRadius: 18,
        padding: 28,
        border: `1px solid ${accentColor}33`,
        boxShadow: `0 0 60px ${accentColor}18, 0 0 120px ${secondaryColor}0a`,
      }}>
        {/* Mock nav bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #1e293b",
        }}>
          <span style={{ fontSize: 28 }}>⛑️</span>
          <span style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            HardhatHQ
          </span>
          <span style={{
            marginLeft: "auto",
            fontSize: 16,
            color: "#475569",
            fontFamily: "sans-serif",
          }}>
            {feature.title}
          </span>
        </div>

        {rows.map((row, i) => (
          <MockRow key={i} delay={18 + i * 12} row={row} accentColor={accentColor} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
