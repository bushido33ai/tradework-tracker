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
      // First check if we have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        // If no session exists, just redirect to home
        navigate("/");
        return;
      }

      // Proceed with sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        // If it's a session error, we should still redirect the user
        if (error.message.includes("session")) {
          navigate("/");
          return;
        }
        toast.error(error.message);
      } else {
        toast.success("Signed out successfully");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error during sign out:", error);
      // Even if there's an error, redirect to home for safety
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