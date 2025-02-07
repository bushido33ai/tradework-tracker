
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminRole = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["adminRole", userId],
    queryFn: async () => {
      if (!userId) {
        console.log("useAdminRole: No user ID provided");
        return false;
      }
      
      console.log("useAdminRole: Checking admin role for user", userId);
      
      const { data, error } = await supabase
        .rpc('has_role', { 
          user_id: userId,
          role: 'admin'
        });

      if (error) {
        console.error("Error checking admin role:", error);
        toast.error("Failed to check admin permissions");
        return false;
      }

      console.log("useAdminRole: Admin check result:", data);
      return data;
    },
    enabled: !!userId,
  });
};
