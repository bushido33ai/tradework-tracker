
import { Link } from "react-router-dom";
import { Home, ClipboardList, MessageSquare, Users, Building2, UserCircle, LogOut, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useProfile } from "@/hooks/useProfile";

interface NavContentProps {
  onNavigate?: () => void;
  onSignOut: () => void;
}

export const NavContent = ({ onNavigate, onSignOut }: NavContentProps) => {
  const location = useLocation();
  const { session } = useSessionContext();
  const { data: isAdmin } = useAdminRole(session?.user?.id);
  const { data: profile } = useProfile(session?.user?.id);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
  ];

  // Add merchant-specific items
  if (profile?.user_type === "merchant") {
    navItems.push({ icon: Briefcase, label: "Traders Directory", path: "/merchant/traders" });
  } else {
    // Add regular items for non-merchants
    navItems.push(
      { icon: ClipboardList, label: "Jobs", path: "/jobs" },
      { icon: MessageSquare, label: "Enquiries", path: "/enquiries" },
      { icon: Users, label: "Suppliers", path: "/suppliers" },
      { icon: Building2, label: "Customers", path: "/customers" }
    );
  }

  // Add common items
  navItems.push({ icon: UserCircle, label: "Profile", path: "/profile" });

  // Add admin settings if user is admin
  if (isAdmin) {
    navItems.push({ icon: Settings, label: "Admin", path: "/admin" });
  }

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
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(item.path) ? "text-white" : "text-gray-300"}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
        onClick={onSignOut}
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className="font-medium">Sign out</span>
      </Button>
    </div>
  );
};
