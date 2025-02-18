
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log("Deleting user completely:", userId);
      
      const { data, error } = await supabase
        .rpc('delete_user_completely', {
          _user_id: userId
        });
      
      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
      
      return userId;
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
