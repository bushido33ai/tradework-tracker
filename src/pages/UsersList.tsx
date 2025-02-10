import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Trash2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const UsersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all profiles with their job counts and admin status
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      console.log("Fetching users with job counts and admin status...");
      
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Then get job counts and admin status for each user
      const usersWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          // Get job count
          const { count: jobCount, error: jobsError } = await supabase
            .from("jobs")
            .select("*", { count: 'exact', head: true })
            .eq("created_by", profile.id);

          if (jobsError) {
            console.error("Error fetching job count:", jobsError);
            return { ...profile, jobCount: 0, isAdmin: false };
          }

          // Check if user is admin
          const { data: isAdmin, error: adminError } = await supabase
            .rpc('has_role', { 
              user_id: profile.id,
              role: 'admin'
            });

          if (adminError) {
            console.error("Error checking admin status:", adminError);
            return { ...profile, jobCount: jobCount || 0, isAdmin: false };
          }

          return { 
            ...profile, 
            jobCount: jobCount || 0,
            isAdmin: isAdmin || false
          };
        })
      );

      console.log("Fetched users with details:", usersWithDetails);
      return usersWithDetails;
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log("Deleting user:", userId);
      
      // Delete the profile first (this will cascade through our RLS policies)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Total Jobs</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/admin/users/${user.id}/jobs`)}
                >
                  {user.full_name || "N/A"}
                </TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell className="capitalize">{user.user_type}</TableCell>
                <TableCell>
                  {user.isAdmin && (
                    <div className="flex items-center text-primary gap-1">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">{user.jobCount}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this user? This action cannot be undone.
                          All associated data will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => deleteUserMutation.mutate(user.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersList;
