
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import UserTypeSelection from "./pages/UserTypeSelection";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
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
import Footer from "@/components/Footer";
import AppBackground from "@/components/AppBackground";
import Admin from "@/pages/Admin";
import UsersList from "@/pages/UsersList";
import UserJobs from "@/pages/UserJobs";
import AdminRoute from "@/components/routes/AdminRoute";
import MerchantTraders from "@/pages/MerchantTraders";
import MerchantTraderJobs from "@/pages/MerchantTraderJobs";
import WorkCalendar from "@/pages/WorkCalendar";

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
                <AppBackground showPattern={false}>
                  <Landing />
                  <Footer />
                </AppBackground>
              } />
              <Route path="/register" element={
                <AppBackground>
                  <UserTypeSelection />
                  <Footer />
                </AppBackground>
              } />
              <Route path="/signup/:userType" element={
                <AppBackground>
                  <SignUp />
                  <Footer />
                </AppBackground>
              } />
              <Route path="/signin" element={
                <AppBackground>
                  <SignIn />
                  <Footer />
                </AppBackground>
              } />
              <Route path="/reset-password" element={
                <AppBackground>
                  <ResetPassword />
                  <Footer />
                </AppBackground>
              } />
              <Route path="/update-password" element={
                <AppBackground>
                  <UpdatePassword />
                  <Footer />
                </AppBackground>
              } />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <AppBackground>
                      <div className="flex min-h-screen flex-col">
                        <Navigation />
                        <main className="flex-1 p-2 md:p-8 mt-20 md:mt-4 mx-2 md:mx-4 md:ml-64 overflow-y-auto">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />
                            <Route path="/calendar" element={<WorkCalendar />} />
                            <Route path="/enquiries" element={<Enquiries />} />
                            <Route path="/enquiries/:id" element={<EnquiryDetails />} />
                            <Route path="/suppliers" element={<Suppliers />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/merchant/traders" element={<MerchantTraders />} />
                            <Route path="/merchant/traders/:traderId/jobs" element={<MerchantTraderJobs />} />
                            <Route path="/admin" element={
                              <AdminRoute>
                                <Admin />
                              </AdminRoute>
                            } />
                            <Route path="/admin/users" element={
                              <AdminRoute>
                                <UsersList />
                              </AdminRoute>
                            } />
                            <Route path="/admin/users/:userId/jobs" element={
                              <AdminRoute>
                                <UserJobs />
                              </AdminRoute>
                            } />
                          </Routes>
                        </main>
                        <Footer />
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
