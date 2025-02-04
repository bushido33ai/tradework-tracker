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
          <main className="flex-1 p-2 md:p-8 mt-20 md:mt-4 mx-2 md:mx-4 md:ml-64">
            {children}
          </main>
          <div className="flex justify-center w-full md:ml-64">
            <Footer />
          </div>
        </div>
      </div>
    </AppBackground>
  );
};