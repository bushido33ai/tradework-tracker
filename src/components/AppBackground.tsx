import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

interface AppBackgroundProps {
  children: React.ReactNode;
  showPattern?: boolean;
}

const AppBackground = ({ children, showPattern = true }: AppBackgroundProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showPattern && (
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        />
      )}
      <div className="flex-1 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AppBackground;