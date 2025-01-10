import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, ClipboardList, Home, Users, UserCircle, Menu, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ClipboardList, label: "Jobs", path: "/jobs" },
    { icon: MessageSquare, label: "Enquiries", path: "/enquiries" },
    { icon: Users, label: "Suppliers", path: "/suppliers" },
    { icon: Building2, label: "Customers", path: "/customers" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const Logo = () => (
    <Link 
      to="/" 
      className="group relative flex items-center gap-3 p-2 transition-all duration-300 rounded-xl hover:-translate-y-0.5"
      onClick={handleNavigation}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-3 rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300 animate-fade-in">
          <Building2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6" />
        </div>
      </div>
      <div className="flex flex-col items-start">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-400 transition-all duration-300">
          TradeMate
        </h1>
        <span className="text-xs text-primary-600/80 group-hover:text-primary-500 transition-colors duration-300">
          Building Excellence
        </span>
      </div>
    </Link>
  );

  const NavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavigation}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary-50 text-primary-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      <Button
        variant="ghost"
        className="w-full justify-start mt-auto text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        onClick={handleSignOut}
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className="font-medium">Sign out</span>
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-50">
        <Logo />
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-8">
              <Logo />
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="h-[calc(100vh-8rem)]">
        <NavContent />
      </div>
    </nav>
  );
};

export default Navigation;