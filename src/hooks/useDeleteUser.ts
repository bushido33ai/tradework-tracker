
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log("Starting deletion process for user:", userId);
      
      try {
        const { data, error } = await supabase.functions.invoke('delete-user', {
          body: { userId }
        });

        if (error) throw error;
        return userId;
      } catch (error) {
        console.error("Error in deletion process:", error);
        throw error;
      }
    },
    onSuccess: (userId) => {
      console.log("Successfully deleted user:", userId);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user: " + error.message);
    },
  });
};
