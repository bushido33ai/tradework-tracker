import { Link, useLocation } from "react-router-dom";
import { Building2, ClipboardList, Home, Users } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ClipboardList, label: "Jobs", path: "/jobs" },
    { icon: Users, label: "Suppliers", path: "/suppliers" },
    { icon: Building2, label: "Company", path: "/company" },
  ];

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center mb-8 px-2">
        <h1 className="text-2xl font-bold text-primary-800">TradeMate</h1>
      </div>
      
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
    </nav>
  );
};

export default Navigation;