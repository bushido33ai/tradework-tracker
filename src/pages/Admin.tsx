
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

const Admin = () => {
  const { session } = useSessionContext();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useAdminRole(session?.user?.id);

  // Fetch all profiles with their user type
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast.error("Failed to load user profiles");
        throw error;
      }
    },
    enabled: !!isAdmin, // Only fetch if user is admin
  });

  // Fetch jobs per user with status counts
  const { data: jobStats, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["admin-jobs-stats"],
    queryFn: async () => {
      try {
        console.log("Fetching job stats for admin view");
        const { data, error } = await supabase
          .from("jobs")
          .select('created_by, status');

        if (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to load job statistics");
          throw error;
        }

        console.log("Fetched job stats:", data);

        // Process the data to count jobs by status for each user
        const stats = (data || []).reduce((acc: Record<string, { total: number, pending: number, in_progress: number, completed: number }>, job) => {
          if (!acc[job.created_by]) {
            acc[job.created_by] = { total: 0, pending: 0, in_progress: 0, completed: 0 };
          }
          acc[job.created_by].total += 1;
          acc[job.created_by][job.status as keyof typeof acc[string]] += 1;
          return acc;
        }, {});

        console.log("Processed job stats:", stats);
        return stats;
      } catch (error) {
        console.error("Error in jobs fetch:", error);
        toast.error("Failed to load job statistics");
        throw error;
      }
    },
    enabled: !!isAdmin, // Only fetch if user is admin
  });

  if (isLoadingAdmin) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const isLoading = isLoadingProfiles || isLoadingJobs;

  const getUserJobStats = (userId: string) => {
    return jobStats?.[userId] || { total: 0, pending: 0, in_progress: 0, completed: 0 };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
            <p className="text-2xl font-bold">{isLoading ? "..." : profiles?.length || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tradesmen</h3>
            <p className="text-2xl font-bold">
              {isLoading ? "..." : profiles?.filter(p => p.user_type === "tradesman").length || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Customers</h3>
            <p className="text-2xl font-bold">
              {isLoading ? "..." : profiles?.filter(p => p.user_type === "customer").length || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Jobs</h3>
            <p className="text-2xl font-bold">
              {isLoading ? "..." : 
                Object.values(jobStats || {}).reduce((sum, stats) => sum + stats.total, 0)
              }
            </p>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          {isLoading ? (
            <div>Loading user data...</div>
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
                  const stats = getUserJobStats(profile.id);
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
                      <TableCell>{stats.in_progress}</TableCell>
                      <TableCell>{stats.completed}</TableCell>
                      <TableCell>
                        {new Date(profile.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Admin;
