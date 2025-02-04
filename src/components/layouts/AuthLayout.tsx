import { Footer } from "@/components/layouts/Footer";
import { AppBackground } from "@/components/layouts/AppBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
  showPattern?: boolean;
}

export const AuthLayout = ({ children, showPattern = true }: AuthLayoutProps) => {
  return (
    <AppBackground showPattern={showPattern}>
      <div className="container mx-auto">
        {children}
        <Footer />
      </div>
    </AppBackground>
  );
};