import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import UserTypeSelection from "./pages/UserTypeSelection";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navigation from "./components/Navigation";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
                  <div className="flex min-h-screen">
                    <Navigation />
                    <main className="flex-1 p-4 md:p-8 content-container my-4 mx-4 md:ml-64">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </main>
                  </div>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;