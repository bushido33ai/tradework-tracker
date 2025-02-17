
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your email for the password reset link");
      navigate("/signin");
    } catch (error: any) {
      console.error("Error during password reset:", error);
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
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Enter your email to reset your password</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] space-y-6 mt-6 border-2 border-primary-100 hover:shadow-[0_0_25px_rgba(30,64,175,0.15)] transition-all duration-300">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link 
                to="/signin" 
                className="text-primary hover:text-primary-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
