import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link. No token provided.');
        setIsVerifying(false);
        return;
      }

      try {
        console.log("Verifying email with token:", token);

        const { data, error } = await supabase.functions.invoke('verify-email', {
          body: { token }
        });

        console.log("Verification response:", { data, error });

        if (error) {
          throw error;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setVerificationStatus('success');
        toast.success("Email verified successfully! You can now sign in.");
        
        // Redirect to sign in after a short delay
        setTimeout(() => {
          navigate("/signin");
        }, 3000);

      } catch (error: any) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Failed to verify email. The link may be invalid or expired.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

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
      <div className="w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center">
            <img 
              src="/trademate-logo.png" 
              alt="TradeMate Logo"
              className="h-12 mx-auto mb-6"
            />
            <CardTitle className="text-2xl font-bold text-primary">
              Email Verification
            </CardTitle>
            <CardDescription>
              {isVerifying && "Verifying your email address..."}
              {verificationStatus === 'success' && "Your email has been verified successfully!"}
              {verificationStatus === 'error' && "Email verification failed"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            {isVerifying && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-gray-600">Please wait while we verify your email...</p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">
                    Your account has been created successfully!
                  </p>
                  <p className="text-gray-600 text-sm">
                    You will be redirected to the sign-in page shortly, or you can click the button below.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/signin")}
                  className="w-full"
                >
                  Go to Sign In
                </Button>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <div className="space-y-2">
                  <p className="text-red-700 font-medium">
                    Verification Failed
                  </p>
                  <p className="text-gray-600 text-sm">
                    {errorMessage}
                  </p>
                </div>
                <div className="space-y-2 w-full">
                  <Button 
                    onClick={() => navigate("/user-type-selection")}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/signin")}
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;