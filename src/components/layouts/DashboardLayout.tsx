import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/layouts/Footer";
import { AppBackground } from "@/components/layouts/AppBackground";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <AppBackground>
      <div className="flex min-h-screen">
        <Navigation />
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col w-full px-2 md:px-4 mt-20 md:mt-4 md:ml-64">
            <main className="flex-1 container mx-auto">
              {children}
            </main>
          </div>
          <div className="flex justify-center w-full md:ml-64">
            <Footer />
          </div>
        </div>
      </div>
    </AppBackground>
  );
};