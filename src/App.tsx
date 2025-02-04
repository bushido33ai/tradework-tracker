import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import Landing from "./pages/Landing";
import UserTypeSelection from "./pages/UserTypeSelection";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <AuthLayout showPattern={false}>
                  <Landing />
                </AuthLayout>
              } />
              <Route path="/register" element={
                <AuthLayout>
                  <UserTypeSelection />
                </AuthLayout>
              } />
              <Route path="/signup/:userType" element={
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              } />
              <Route path="/signin" element={
                <AuthLayout>
                  <SignIn />
                </AuthLayout>
              } />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
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
                    </DashboardLayout>
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