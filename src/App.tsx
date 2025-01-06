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
import CreateJob from "./pages/CreateJob";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";

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
                    <main className="flex-1 ml-64 p-8 content-container my-4 mr-4">
                      <Routes>
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/create" element={<CreateJob />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />
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