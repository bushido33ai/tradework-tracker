import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white" style={{ backgroundImage: 'none' }}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center">Welcome to TradeMate</h1>
        <p className="mt-4 text-center">
          Manage your jobs, track costs, and boost profitability with our all-in-one platform.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
