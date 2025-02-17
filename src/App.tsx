import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import ResetPassword from "@/pages/ResetPassword";  // Add import
import Landing from "./pages/Landing";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />  {/* Add new route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Toaster position="top-right" />
      </main>
    </Router>
  );
};

export default App;
