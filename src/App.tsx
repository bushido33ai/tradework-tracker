import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const session = supabase.auth.getSession();
  
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
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<UserTypeSelection />} />
                <Route path="/signup/:userType" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <div className="flex min-h-screen">
                        <Navigation />
                        <main className="flex-1 p-2 md:p-8 content-container mt-20 md:mt-4 mx-2 md:mx-4 md:ml-64">
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
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;