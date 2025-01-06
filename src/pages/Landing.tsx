import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Track multiple jobs efficiently",
  "Manage supplier relationships",
  "Monitor costs and profitability",
  "Minimise administrative overheads",
];

const Landing = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/136602a8-f1a5-4465-8db7-36485b6fc5ae.png')`
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/69663853-babf-463e-8762-de5c956a648b.png" 
              alt="TradeMate Logo" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                console.error("Failed to load logo image");
                e.currentTarget.style.display = 'none';
              }}
            />
            <h1 className="text-2xl font-bold text-primary-800">TradeMate</h1>
          </div>
          <div className="space-x-4">
            <Link to="/signin">
              <Button
                variant="outline"
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Button>
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Manage Your Trade Business{" "}
              <span className="text-primary-600">Efficiently</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              The all-in-one platform for tradesmen to manage jobs, track costs, save time and make a tradesman's life easier.
            </p>

            <div className="flex justify-center space-x-4 mb-12">
              <Link
                to="/register"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <img
              src="/lovable-uploads/3143329b-2054-4942-8bf7-8c9113821903.png"
              alt="Architectural Planning"
              className="rounded-lg shadow-xl w-full h-64 object-cover"
              onError={(e) => {
                console.error("Failed to load planning image");
                e.currentTarget.style.display = 'none';
              }}
            />
            <img
              src="/lovable-uploads/2cb4ae81-e570-47a8-9002-4a9522803d47.png"
              alt="Modern Construction"
              className="rounded-lg shadow-xl w-full h-64 object-cover"
              onError={(e) => {
                console.error("Failed to load construction image");
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center space-x-3 bg-white/80 p-4 rounded-lg shadow-sm backdrop-blur-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
