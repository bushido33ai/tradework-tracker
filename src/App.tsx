import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";

const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
      </Routes>
    </Router>
  );
};

export default App;