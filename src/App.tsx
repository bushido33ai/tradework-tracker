import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Landing from "./pages/Landing";
import UserTypeSelection from "./pages/UserTypeSelection";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navigation from "./components/Navigation";
import Jobs from "./pages/Jobs";
import Enquiries from "./pages/Enquiries";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import EnquiryDetails from "./pages/EnquiryDetails";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, session, error } = useSessionContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          toast.error("Authentication error. Please sign in again.");
        }
        setIsChecking(false);
      } catch (err) {
        console.error("Session check failed:", err);
        setIsChecking(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading || isChecking) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

const AppBackground = ({ children, showPattern = true }: { children: React.ReactNode, showPattern?: boolean }) => {
  return (
    <div className="min-h-screen relative">
      {showPattern && (
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppBackground showPattern={false}><Landing /></AppBackground>} />
              <Route path="/register" element={<AppBackground><UserTypeSelection /></AppBackground>} />
              <Route path="/signup/:userType" element={<AppBackground><SignUp /></AppBackground>} />
              <Route path="/signin" element={<AppBackground><SignIn /></AppBackground>} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <AppBackground>
                      <div className="flex min-h-screen">
                        <Navigation />
                        <main className="flex-1 p-2 md:p-8 mt-20 md:mt-4 mx-2 md:mx-4 md:ml-64">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />
                            <Route path="/enquiries" element={<Enquiries />} />
                            <Route path="/enquiries/:id" element={<EnquiryDetails />} />
                            <Route path="/suppliers" element={<Suppliers />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/profile" element={<Profile />} />
                          </Routes>
                        </main>
                      </div>
                    </AppBackground>
                  </PrivateRoute>
                }
              />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;