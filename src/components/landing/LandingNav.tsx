
import { Link, useNavigate } from "react-router-dom";
import { ButtonColorful } from "@/components/ui/button-colorful";
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
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        // If there's no valid session, just redirect to home
        navigate("/");
        return;
      }

      if (!currentSession) {
        // No active session, just redirect
        navigate("/");
        return;
      }

      // Proceed with logout if we have a valid session
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        if (error.message.includes("session_not_found")) {
          // Session already invalid, just redirect
          navigate("/");
          return;
        }
        toast.error("Error signing out");
        return;
      }

      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      // In case of any other error, still redirect to home
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link 
            to="/" 
            className="group relative flex items-center gap-3 p-2 pt-4 transition-all duration-300 rounded-xl hover:-translate-y-0.5"
          >
            <img 
              src="/lovable-uploads/new-trademate-logo.png" 
              alt="TradeMate Logo" 
              className="w-52 h-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <ButtonColorful
                label="Sign out"
                onClick={handleSignOut}
              />
            ) : (
              <Link to="/signin">
                <ButtonColorful
                  label="Sign in"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
