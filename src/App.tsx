import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import Suppliers from "@/pages/Suppliers";
import Profile from "@/pages/Profile";
import Index from "@/pages/Index";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-8 ml-64">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;