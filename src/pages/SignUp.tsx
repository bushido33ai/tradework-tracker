
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
import { sendEmail } from "@/utils/email";

const SignUp = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/trademate-logo.png')`,
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
            src="/trademate-logo.png" 
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

        <div className="text-center space-y-4">
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
