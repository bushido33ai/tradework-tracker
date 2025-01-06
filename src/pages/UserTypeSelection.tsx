import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Hammer, Home, Store } from "lucide-react";

const UserTypeSelection = () => {
  const options = [
    {
      title: "I am a tradesman",
      icon: <Hammer className="w-8 h-8" />,
      description: "Access tools to manage jobs, track costs, and grow your business",
      value: "tradesman"
    },
    {
      title: "I am a customer/homeowner",
      icon: <Home className="w-8 h-8" />,
      description: "Find and hire qualified tradesmen for your projects",
      value: "customer"
    },
    {
      title: "I am a builders merchant",
      icon: <Store className="w-8 h-8" />,
      description: "Connect with tradesmen and manage your inventory",
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
                className="p-6 flex flex-col items-center text-center cursor-pointer card-hover"
              >
                <div className="mb-4 text-primary">{option.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <Button className="w-full">
                  Continue
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;