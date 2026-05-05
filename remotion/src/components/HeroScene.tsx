import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface HeroSceneProps {
  appName: string;
  tagline: string;
  accentColor: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  appName,
  tagline,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 14 } });
  const taglineOpacity = interpolate(frame, [30, 60], [0, 1]);
  const taglineY = interpolate(frame, [30, 60], [20, 0]);

  // Subtle grid lines in background
  const gridOpacity = interpolate(frame, [0, 40], [0, 0.12]);

  // Fade out at the end
  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated grid background */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: gridOpacity,
        }}
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={accentColor}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          transform: `scale(${titleScale})`,
        }}
      />

      {/* App name */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
          letterSpacing: -2,
          transform: `scale(${titleScale})`,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        {appName.split(" ").map((word, i) => (
          <span
            key={i}
            style={{ color: i === 1 ? accentColor : "#ffffff" }}
          >
            {word}{" "}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 32,
          fontSize: 36,
          fontFamily: "system-ui, sans-serif",
          color: "#a0a0a0",
          fontWeight: 400,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        {tagline}
      </div>

      {/* Accent divider */}
      <div
        style={{
          marginTop: 48,
          width: interpolate(frame, [60, 120], [0, 300]),
          height: 4,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${accentColor}, #fb923c)`,
        }}
      />
    </AbsoluteFill>
  );
};
