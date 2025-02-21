
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logo } from "./navigation/Logo";
import { NavContent } from "./navigation/NavContent";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSessionContext();
  
  const handleSignOut = async () => {
    try {
      // First check if we have a valid session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        // If there's no valid session, just redirect to home
        navigate("/");
        return;
      }

      if (!currentSession) {
        // No active session, just redirect
        navigate("/");
        return;
      }

      // Proceed with logout if we have a valid session
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        if (error.message.includes("session_not_found")) {
          // Session already invalid, just redirect
          navigate("/");
          return;
        }
        toast.error("Error signing out");
        return;
      }

      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      // In case of any other error, still redirect to home
      navigate("/");
    }
  };

  const handleNavigation = () => {
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#1A1F2C] text-white border-b border-[#2A2F3C] px-4 flex items-center justify-between z-50">
        <Logo onClick={handleNavigation} />
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A2F3C]">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 bg-[#1A1F2C] text-white border-r border-[#2A2F3C]">
            <div className="mb-8">
              <Logo onClick={handleNavigation} />
            </div>
            <NavContent onNavigate={handleNavigation} onSignOut={handleSignOut} />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-[#1A1F2C] text-white border-r border-[#2A2F3C] p-4 hidden md:block">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="h-[calc(100vh-8rem)]">
        <NavContent onSignOut={handleSignOut} />
      </div>
    </nav>
  );
};

export default Navigation;
