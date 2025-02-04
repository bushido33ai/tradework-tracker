import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Users,
  Store,
  UserCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NavContentProps {
  onNavigate?: () => void;
  onSignOut?: () => void;
}

export const NavContent = ({ onNavigate, onSignOut }: NavContentProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      return profile;
    },
  });

  const isMerchant = userProfile?.user_type === "merchant";

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/jobs",
      label: "Jobs",
      icon: Briefcase,
    },
    {
      href: "/enquiries",
      label: "Enquiries",
      icon: MessageSquare,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/suppliers",
      label: "Suppliers",
      icon: Store,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: UserCircle,
    },
    ...(isMerchant ? [{
      href: "/access-requests",
      label: "Access Requests",
      icon: ShieldCheck,
    }] : []),
  ];

  return (
    <div className="space-y-4">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white",
              currentPath === link.href && "bg-[#2A2F3C] text-white"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="pt-4 border-t border-[#2A2F3C]">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-[#2A2F3C]"
          onClick={onSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
};