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
  tagline2: string;
  accentColor: string;
  secondaryColor: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  appName,
  tagline,
  tagline2,
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14 }, from: 0, to: 1 });
  const line1Opacity = interpolate(frame, [20, 45], [0, 1]);
  const line1Y = interpolate(frame, [20, 45], [24, 0]);
  const line2Opacity = interpolate(frame, [40, 65], [0, 1]);
  const line2Y = interpolate(frame, [40, 65], [24, 0]);
  const subOpacity = interpolate(frame, [65, 90], [0, 1]);
  const subY = interpolate(frame, [65, 90], [16, 0]);
  const dividerWidth = interpolate(frame, [80, 140], [0, 360]);

  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        background: "linear-gradient(135deg, #0a0e1a 0%, #0d1117 50%, #0a0a1f 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={accentColor} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glow blobs */}
      <div style={{
        position: "absolute",
        width: 700,
        height: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}1a 0%, transparent 65%)`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }} />
      <div style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${secondaryColor}11 0%, transparent 65%)`,
        top: "30%",
        right: "10%",
      }} />

      {/* Hardhat logo icon */}
      <div style={{
        transform: `scale(${logoScale})`,
        fontSize: 110,
        lineHeight: 1,
        marginBottom: 32,
        filter: "drop-shadow(0 0 32px #f59e0b88)",
      }}>
        ⛑️
      </div>

      {/* App name */}
      <div style={{
        transform: `scale(${logoScale})`,
        fontSize: 104,
        fontWeight: 900,
        fontFamily: "system-ui, sans-serif",
        letterSpacing: -3,
        background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
        marginBottom: 40,
      }}>
        {appName}
      </div>

      {/* Tagline line 1 */}
      <div style={{
        opacity: line1Opacity,
        transform: `translateY(${line1Y}px)`,
        fontSize: 56,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
        color: "#ffffff",
        textAlign: "center",
        lineHeight: 1.15,
      }}>
        {tagline}
      </div>

      {/* Tagline line 2 */}
      <div style={{
        opacity: line2Opacity,
        transform: `translateY(${line2Y}px)`,
        fontSize: 56,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
        color: "#ffffff",
        textAlign: "center",
        lineHeight: 1.15,
        marginBottom: 32,
      }}>
        {tagline2}
      </div>

      {/* Sub-tagline */}
      <div style={{
        opacity: subOpacity,
        transform: `translateY(${subY}px)`,
        fontSize: 26,
        fontFamily: "sans-serif",
        color: "#94a3b8",
        textAlign: "center",
        maxWidth: 820,
        lineHeight: 1.6,
      }}>
        Quote jobs in minutes, track every cost, and know exactly where your profit goes — all from your phone.
      </div>

      {/* Accent divider */}
      <div style={{
        marginTop: 48,
        width: dividerWidth,
        height: 4,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
      }} />
    </AbsoluteFill>
  );
};
