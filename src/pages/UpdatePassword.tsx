
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Try to parse tokens from hash first, then from query string
        const getParams = () => {
          if (window.location.hash && window.location.hash.length > 1) {
            return new URLSearchParams(window.location.hash.slice(1));
          }
          if (window.location.search && window.location.search.length > 1) {
            return new URLSearchParams(window.location.search.slice(1));
          }
          return null;
        };

        const params = getParams();
        if (params) {
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            try {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (error) {
                console.error('Error setting session from recovery link:', error);
                toast.error("Invalid or expired password reset link");
                navigate("/signin");
              }
            } catch (err) {
              console.error('Failed to set session from recovery link:', err);
              toast.error("Invalid or expired password reset link");
              navigate("/signin");
            }
          } else {
            toast.error("Invalid or expired password reset link");
            navigate("/signin");
          }
        } else {
          toast.error("Invalid or expired password reset link");
          navigate("/signin");
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Sign out after password update to force re-login with new password
      await supabase.auth.signOut();
      
      toast.success("Password updated successfully. Please sign in with your new password.");
      navigate("/signin");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />
      
      <div className="w-full max-w-md relative z-10 -mt-8">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center mb-8 group"
          >
            <img 
              src="/lovable-uploads/15450379-3a61-442e-83d8-3bd0bc091a36.png" 
              alt="TradeMate Logo" 
              className="w-64 h-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Update Password</h2>
          <p className="mt-2 text-gray-600">Enter your new password</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] space-y-6 mt-6 border-2 border-primary-100 hover:shadow-[0_0_25px_rgba(30,64,175,0.15)] transition-all duration-300">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
