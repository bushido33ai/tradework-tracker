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

  // Show loading state while checking admin status
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

  return <AdminDashboard />;
};

const AdminDashboard = () => {
  // Fetch all profiles
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log("Fetching profiles...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load profiles");
        throw error;
      }

      console.log("Fetched profiles:", data);
      return data || [];
    },
  });

  if (isLoadingProfiles) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Basic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{profiles?.length || 0}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Tradesmen</h3>
          <p className="text-3xl font-bold">
            {profiles?.filter(p => p.user_type === 'tradesman').length || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Customers</h3>
          <p className="text-3xl font-bold">
            {profiles?.filter(p => p.user_type === 'customer').length || 0}
          </p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>User Type</TableHead>
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
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Admin;