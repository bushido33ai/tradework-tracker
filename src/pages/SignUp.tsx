
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

      // Set up metadata with all required fields
      const metadata = {
        user_type: userType,
        address: cleanedAddress,
        telephone: cleanedTelephone,
        email: cleanedEmail,
        first_name: cleanedFirstName,
        surname: cleanedSurname,
      };

      console.log("Sending signup request with metadata:", metadata);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: cleanedEmail,
        password: data.password,
        options: {
          data: metadata,
        },
      });

      console.log("Signup response:", { signUpData, signUpError });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      if (signUpData.user) {
        toast.success("Account created successfully! Please check your email to verify your account.");
        navigate("/signin");
      } else {
        throw new Error("Failed to create account");
      }
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || "Failed to create account. Please try again.");
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
      <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 flex-1 pr-6">
            {getTitleByUserType()}
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SignUpFormFields form={form} />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-primary hover:text-primary-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
