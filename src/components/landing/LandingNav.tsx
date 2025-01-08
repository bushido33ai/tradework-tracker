import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LandingNavProps {
  session: any;
}

export const LandingNav = ({ session }: LandingNavProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("There was a problem signing out. Please try again.");
      } else {
        toast.success("Signed out successfully");
      }

      // Always navigate to home page regardless of sign out success
      navigate("/");
      
    } catch (error) {
      console.error("Error in sign out process:", error);
      toast.error("An unexpected error occurred. Please try again.");
      // Still navigate to home page
      navigate("/");
    }
  };

  return (
    <nav className="flex justify-between items-center mb-16">
      <Link to="/" className="group transition-all">
        <h1 className="text-2xl font-bold text-primary-800 group-hover:text-primary-600 transition-colors">
          TradeMate
        </h1>
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