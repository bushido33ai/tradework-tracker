import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface CtaSceneProps {
  appName: string;
  accentColor: string;
}

export const CtaScene: React.FC<CtaSceneProps> = ({ appName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14 }, from: 0.8, to: 1 });
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  const buttonScale = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 10 },
    from: 0,
    to: 1,
  });

  // Pulsing glow
  const glowSize = interpolate(
    frame,
    [0, 30, 60],
    [500, 580, 500],
    { extrapolateRight: "extend" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        overflow: "hidden",
      }}
    >
      {/* Pulsing background glow */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          Start using{" "}
          <span style={{ color: accentColor }}>{appName}</span>
          <br />
          today — for free
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#777",
            fontFamily: "sans-serif",
            fontWeight: 400,
          }}
        >
          No credit card required · Set up in minutes
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          transform: `scale(${buttonScale})`,
          background: accentColor,
          color: "#fff",
          fontSize: 32,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          padding: "24px 72px",
          borderRadius: 999,
          letterSpacing: 0.5,
          boxShadow: `0 0 60px ${accentColor}88`,
          zIndex: 1,
        }}
      >
        Get Started Free →
      </div>

      {/* App name footer */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          fontSize: 20,
          color: "#333",
          fontFamily: "monospace",
          letterSpacing: 3,
          zIndex: 1,
        }}
      >
        {appName.toUpperCase()} · tradeworktracker.app
      </div>
    </AbsoluteFill>
  );
};
