import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const features = [
  "Track multiple jobs efficiently",
  "Manage supplier relationships",
  "Monitor costs and profitability",
  "Generate professional reports",
];

// Only create Supabase client if environment variables are available
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Landing = () => {
  const handleGoogleLogin = async () => {
    try {
      toast.loading("Connecting to Google...");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        toast.error("Failed to sign in with Google");
        console.error("Google sign-in error:", error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-primary-800">TradeMate</h1>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in with Google
            </Button>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your Trade Business{" "}
            <span className="text-primary-600">Efficiently</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The all-in-one platform for tradesmen to manage jobs, track costs, and
            boost profitability.
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

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm"
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
