import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

interface AppBackgroundProps {
  children: React.ReactNode;
  showPattern?: boolean;
}

export const AppBackground = ({ children, showPattern = true }: AppBackgroundProps) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      {showPattern && (
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        />
      )}
      <div className="relative z-10 flex-1">
        {children}
      </div>
    </div>
  );
};