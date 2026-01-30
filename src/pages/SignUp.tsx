
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { SignUpFormFields } from "@/components/signup/SignUpFormFields";
import { signUpSchema } from "@/components/signup/validation";
import type { SignUpFormData } from "@/components/signup/types";
import { Separator } from "@/components/ui/separator";

const SignUp = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      surname: "",
      address: "",
      telephone: "",
    },
  });

  const handleGoogleSignUp = async () => {
    if (isGoogleLoading || !userType) return;
    
    setIsGoogleLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("Google sign up error:", error);
        toast.error(error.message || "Failed to sign up with Google");
      }
    } catch (error: any) {
      console.error("Google sign up error:", error);
      toast.error(error.message || "Failed to sign up with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (isLoading || !userType) return;
    
    setIsLoading(true);
    console.log("Starting signup process with data:", { ...data, userType });
    
    try {
      // Validate user type
      const validUserTypes = ['tradesman', 'customer', 'merchant'] as const;
      type UserType = typeof validUserTypes[number];
      
      if (!validUserTypes.includes(userType as UserType)) {
        throw new Error('Invalid user type');
      }

      // Clean up the data before sending
      const cleanedEmail = data.email.trim().toLowerCase();
      const cleanedAddress = data.address.trim();
      const cleanedTelephone = data.telephone.trim();
      const cleanedFirstName = data.firstName.trim();
      const cleanedSurname = data.surname.trim();

      console.log("Sending verification email request");

      // Send verification email instead of creating account directly
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: cleanedEmail,
          password: data.password,
          firstName: cleanedFirstName,
          surname: cleanedSurname,
          address: cleanedAddress,
          telephone: cleanedTelephone,
          userType: userType,
          appUrl: window.location.origin
        }
      });

      console.log("Verification email response:", { verificationData, verificationError });

      if (verificationError) {
        console.error("Verification email error:", verificationError);
        throw verificationError;
      }

      if (verificationData?.error) {
        throw new Error(verificationData.error);
      }

      toast.success("Verification email sent! Please check your inbox and click the verification link to activate your account.");
      navigate("/signin");
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || "Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTitleByUserType = () => {
    switch (userType) {
      case "tradesman":
        return "Sign up as a Tradesman";
      case "customer":
        return "Sign up as a Customer";
      case "merchant":
        return "Sign up as a Merchant";
      default:
        return "Sign Up";
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/342506cf-411e-4195-9c10-5f806c52d3b7.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-lg space-y-8 bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl border-0">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img 
            src="/lovable-uploads/342506cf-411e-4195-9c10-5f806c52d3b7.png" 
            alt="TradeMate Logo" 
            className="h-12 mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-primary mb-2">
            {getTitleByUserType()}
          </h2>
          <p className="text-gray-600">
            Join thousands of professionals using TradeMate
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SignUpFormFields form={form} />

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Creating your account..." : "Create My Account"}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
            or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <div className="text-center space-y-4 mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-primary hover:text-primary-700 transition-colors"
            >
              Sign in here
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
