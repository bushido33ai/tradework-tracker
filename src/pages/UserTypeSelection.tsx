import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Hammer, Home, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ButtonColorful } from "@/components/ui/button-colorful";

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
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('/trademate-logo.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <img 
              src="/trademate-logo.png" 
              alt="TradeMate Logo" 
              className="h-16 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Join TradeMate Today
            </h1>
            <p className="text-lg text-gray-600">
              Choose your account type to get started with our free platform
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {options.map((option) => (
              <Card 
                key={option.value}
                className="p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg"
              >
                <div className="mb-6 p-4 bg-primary/10 rounded-full text-primary">{option.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{option.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>
                <ButtonColorful 
                  label="Get Started"
                  onClick={() => handleUserTypeSelection(option.value)}
                  className="w-full mt-auto"
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;