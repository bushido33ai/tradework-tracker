import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;