import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Hammer, Home, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RainbowButton } from "@/components/ui/rainbow-button";

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = async (userType: string) => {
    try {
      // Store the selected user type in session storage for the signup process
      sessionStorage.setItem('selectedUserType', userType);
      navigate(`/signup/${userType}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const options = [
    {
      title: "I am a tradesman",
      icon: <Hammer className="w-8 h-8" />,
      description: "Register here if you are tradesman looking to simplify management, invoicing & paperwork for your building jobs",
      value: "tradesman"
    },
    {
      title: "I am a customer/homeowner",
      icon: <Home className="w-8 h-8" />,
      description: "Register here if you are a customer wanting to keep a track of your building works",
      value: "customer"
    },
    {
      title: "I am a builders merchant",
      icon: <Store className="w-8 h-8" />,
      description: "Register here if you are a builders merchant providing materials to the building industry",
      value: "merchant"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Select Your Account Type
          </h1>
          
          <div className="grid gap-6 md:grid-cols-3">
            {options.map((option) => (
              <Card 
                key={option.value}
                className="p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 text-primary">{option.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <RainbowButton 
                  className="w-full"
                  onClick={() => handleUserTypeSelection(option.value)}
                >
                  Continue
                </RainbowButton>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;