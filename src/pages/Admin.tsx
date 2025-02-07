
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

const Admin = () => {
  const { session } = useSessionContext();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useAdminRole(session?.user?.id);

  // Fetch all profiles with their user type
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  // Fetch jobs count per user
  const { data: jobsPerUser, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["admin-jobs-per-user"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("created_by, count(*)")
        .group("created_by");

      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  if (isLoadingAdmin) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const isLoading = isLoadingProfiles || isLoadingJobs;

  const getUserJobCount = (userId: string) => {
    const userJobs = jobsPerUser?.find(j => j.created_by === userId);
    return userJobs?.count || 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <TableHead>Jobs Created</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.full_name || "Not set"}</TableCell>
                    <TableCell>{profile.email || "Not set"}</TableCell>
                    <TableCell>
                      <Badge variant={profile.user_type === "tradesman" ? "default" : "secondary"}>
                        {profile.user_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{getUserJobCount(profile.id)}</TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Admin;
