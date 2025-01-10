import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

interface LandingNavProps {
  session: any;
}

export const LandingNav = ({ session }: LandingNavProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <nav className="flex justify-between items-center mb-16">
      <Link 
        to="/" 
        className="group relative flex items-center gap-3 p-2 transition-all duration-300 rounded-xl hover:-translate-y-0.5"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-3 rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <Building2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6" />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-400 transition-all duration-300">
            TradeMate
          </h1>
          <span className="text-xs text-primary-600/80 group-hover:text-primary-500 transition-colors duration-300">
            Building Excellence
          </span>
        </div>
      </Link>
      <div className="space-x-4">
        {session ? (
          <Button
            variant="outline"
            className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
};