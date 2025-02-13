
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log("Deleting user:", userId);
      
      const { error: permissionsError } = await supabase
        .from('job_access_permissions')
        .delete()
        .eq('granted_by', userId);
      
      if (permissionsError) {
        console.error("Error deleting job access permissions:", permissionsError);
        throw permissionsError;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error("Error deleting profile:", profileError);
        throw profileError;
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
