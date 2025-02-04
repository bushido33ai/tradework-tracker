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
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
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
              src="/lovable-uploads/15450379-3a61-442e-83d8-3bd0bc091a36.png" 
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