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
  secondaryColor: string;
}

export const CtaScene: React.FC<CtaSceneProps> = ({
  appName,
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14 }, from: 0.8, to: 1 });
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  const buttonScale = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 10 },
    from: 0,
    to: 1,
  });
  const badgeOpacity = interpolate(frame, [30, 50], [0, 1]);

  // Pulsing glow
  const glowSize = interpolate(frame, [0, 30, 60, 90, 120], [500, 580, 500, 560, 500], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a0e1a 0%, #0d1117 50%, #0a0a1f 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 44,
      overflow: "hidden",
    }}>
      {/* Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={accentColor} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" />
      </svg>

      {/* Glow */}
      <div style={{
        position: "absolute",
        width: glowSize,
        height: glowSize,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}22 0%, transparent 65%)`,
      }} />
      <div style={{
        position: "absolute",
        width: glowSize * 0.7,
        height: glowSize * 0.7,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${secondaryColor}18 0%, transparent 65%)`,
        top: "20%",
        right: "20%",
      }} />

      {/* Logo + name */}
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        zIndex: 1,
      }}>
        <span style={{
          fontSize: 100,
          lineHeight: 1,
          filter: "drop-shadow(0 0 32px #f59e0b88)",
        }}>⛑️</span>

        <div style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: -2,
          lineHeight: 1,
        }}>
          {appName}
        </div>

        <div style={{
          fontSize: 32,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.3,
        }}>
          Ditch the Paperwork.{"\n"}
          <span style={{ color: "#94a3b8", fontWeight: 400 }}>
            Get Back to the Work That Pays.
          </span>
        </div>
      </div>

      {/* CTA button */}
      <div style={{
        transform: `scale(${buttonScale})`,
        background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
        color: "#fff",
        fontSize: 30,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
        padding: "22px 68px",
        borderRadius: 999,
        letterSpacing: 0.5,
        boxShadow: `0 0 60px ${accentColor}66`,
        zIndex: 1,
      }}>
        Start Free Today →
      </div>

      {/* Trust badges */}
      <div style={{
        opacity: badgeOpacity,
        display: "flex",
        gap: 32,
        zIndex: 1,
      }}>
        {["✓ No credit card", "✓ Set up in minutes", "✓ Works on any device"].map((t) => (
          <span key={t} style={{
            fontSize: 20,
            color: "#475569",
            fontFamily: "sans-serif",
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* URL footer */}
      <div style={{
        position: "absolute",
        bottom: 40,
        fontSize: 18,
        color: "#1e293b",
        fontFamily: "monospace",
        letterSpacing: 3,
        zIndex: 1,
      }}>
        HARDHATHQ.APP
      </div>
    </AbsoluteFill>
  );
};
