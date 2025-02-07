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

  // If still loading admin status, show loading spinner
  if (isLoadingAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not admin, redirect to dashboard
  if (!isAdmin) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  // Only render the admin content if user is confirmed as admin
  return <AdminDashboard />;
};

// Separate component for the dashboard content
const AdminDashboard = () => {
  const { session } = useSessionContext();

  // Fetch all profiles
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast.error("Failed to load profiles");
        throw profilesError;
      }

      return profilesData || [];
    },
    enabled: !!session?.user?.id,
  });

  // Fetch all jobs
  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
        toast.error("Failed to load jobs");
        throw jobsError;
      }

      return jobsData || [];
    },
    enabled: !!session?.user?.id,
  });

  if (isLoadingProfiles || isLoadingJobs) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profiles || !jobs) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Calculate job statistics
  const jobStats = jobs.reduce((acc: Record<string, { total: number, pending: number, in_progress: number, completed: number }>, job) => {
    if (!acc[job.created_by]) {
      acc[job.created_by] = { total: 0, pending: 0, in_progress: 0, completed: 0 };
    }
    acc[job.created_by].total += 1;
    if (job.status) {
      acc[job.created_by][job.status as keyof typeof acc[string]] = 
        (acc[job.created_by][job.status as keyof typeof acc[string]] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{profiles.length}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Jobs</h3>
          <p className="text-3xl font-bold">{jobs.length}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Active Users</h3>
          <p className="text-3xl font-bold">
            {profiles.filter(p => p.user_type === 'tradesman').length}
          </p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Details & Job Statistics</h2>
          <div className="overflow-x-auto">
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
                {profiles.map((profile) => {
                  const stats = jobStats[profile.id] || {
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Admin;