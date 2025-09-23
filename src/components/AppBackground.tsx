import { WavyBackground } from "@/components/ui/wavy-background";

interface AppBackgroundProps {
  children: React.ReactNode;
  showPattern?: boolean;
}

const AppBackground = ({ children, showPattern = true }: AppBackgroundProps) => {
  if (!showPattern) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <WavyBackground
      containerClassName="min-h-screen"
      className="flex-1"
      colors={[
        "hsl(var(--primary))",
        "hsl(var(--primary) / 0.8)",
        "hsl(var(--primary) / 0.6)",
        "hsl(var(--accent))",
        "hsl(var(--secondary))"
      ]}
      waveWidth={50}
      backgroundFill="hsl(var(--background))"
      blur={15}
      speed="slow"
      waveOpacity={0.3}
    >
      {children}
    </WavyBackground>
  );
};

export default AppBackground;