import { Link, useLocation } from "react-router-dom";
import { Building2, ClipboardList, Home, Users, UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ClipboardList, label: "Jobs", path: "/jobs" },
    { icon: Users, label: "Suppliers", path: "/suppliers" },
    { icon: Building2, label: "Customers", path: "/customers" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  const NavContent = () => (
    <div className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
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
  );

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-50">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold text-primary-800">TradeMate</h1>
        </Link>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="flex items-center mb-8 px-2">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold text-primary-800">TradeMate</h1>
              </Link>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center mb-8 px-2">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-primary-800">TradeMate</h1>
        </Link>
      </div>
      <NavContent />
    </nav>
  );
};

export default Navigation;