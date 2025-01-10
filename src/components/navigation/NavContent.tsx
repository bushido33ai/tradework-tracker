import { Link } from "react-router-dom";
import { Home, ClipboardList, MessageSquare, Users, Building2, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface NavContentProps {
  onNavigate?: () => void;
  onSignOut: () => void;
}

export const NavContent = ({ onNavigate, onSignOut }: NavContentProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ClipboardList, label: "Jobs", path: "/jobs" },
    { icon: MessageSquare, label: "Enquiries", path: "/enquiries" },
    { icon: Users, label: "Suppliers", path: "/suppliers" },
    { icon: Building2, label: "Customers", path: "/customers" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
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
        onClick={onSignOut}
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className="font-medium">Sign out</span>
      </Button>
    </div>
  );
};