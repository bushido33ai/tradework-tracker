import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const { session } = useSessionContext();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useAdminRole(session?.user?.id);

  // Fetch all profiles with their user type
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log("Fetching profiles for admin view");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load user profiles");
        throw error;
      }
      
      console.log("Fetched profiles:", data);
      return data || [];
    },
    enabled: !!isAdmin && !!session?.user?.id,
  });

  // Fetch jobs per user with status counts
  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      console.log("Fetching jobs for admin view");
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
        throw error;
      }

      console.log("Fetched jobs:", data);
      return data || [];
    },
    enabled: !!isAdmin && !!session?.user?.id,
  });

  if (isLoadingAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const isLoading = isLoadingProfiles || isLoadingJobs;

  // Calculate job statistics per user
  const jobStats = jobs?.reduce((acc: Record<string, { total: number, pending: number, in_progress: number, completed: number }>, job) => {
    if (!acc[job.created_by]) {
      acc[job.created_by] = { total: 0, pending: 0, in_progress: 0, completed: 0 };
    }
    acc[job.created_by].total += 1;
    if (job.status) {
      acc[job.created_by][job.status] = (acc[job.created_by][job.status] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Users</h3>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                profiles?.length || 0
              )}
            </p>
          </Card>
          
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                jobs?.length || 0
              )}
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Active Users</h3>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                profiles?.filter(p => p.user_type === 'tradesman').length || 0
              )}
            </p>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Details & Job Statistics</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Total Jobs</TableHead>
                    <TableHead>In Progress</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles?.map((profile) => {
                    const stats = jobStats?.[profile.id] || { 
                      total: 0, 
                      pending: 0, 
                      in_progress: 0, 
                      completed: 0 
                    };
                    
                    return (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.full_name || "Not set"}</TableCell>
                        <TableCell>{profile.email || "Not set"}</TableCell>
                        <TableCell>
                          <Badge variant={profile.user_type === "tradesman" ? "default" : "secondary"}>
                            {profile.user_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{stats.total}</TableCell>
                        <TableCell>{stats.in_progress || 0}</TableCell>
                        <TableCell>{stats.completed || 0}</TableCell>
                        <TableCell>
                          {new Date(profile.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;