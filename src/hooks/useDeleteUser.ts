
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log("Starting deletion process for user:", userId);
      
      try {
        // 1. Delete from user_roles
        const { error: rolesError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
        
        if (rolesError) {
          console.error("Error deleting user roles:", rolesError);
          throw rolesError;
        }

        // 2. Delete any job permissions
        const { error: permissionsError } = await supabase
          .from('job_access_permissions')
          .delete()
          .eq('granted_by', userId);
        
        if (permissionsError) {
          console.error("Error deleting job permissions:", permissionsError);
          throw permissionsError;
        }

        // 3. Delete from access_requests
        const { error: accessRequestError } = await supabase
          .from('access_requests')
          .delete()
          .eq('user_id', userId);
        
        if (accessRequestError) {
          console.error("Error deleting access requests:", accessRequestError);
          throw accessRequestError;
        }

        // 4. Delete from profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (profileError) {
          console.error("Error deleting profile:", profileError);
          throw profileError;
        }

        // 5. Finally, delete the user from auth.users using admin API
        const { error: authError } = await supabase.auth.admin.deleteUser(
          userId
        );

        if (authError) {
          console.error("Error deleting auth user:", authError);
          throw authError;
        }

        console.log("Successfully deleted user and all related data");
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
