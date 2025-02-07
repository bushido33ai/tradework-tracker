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
import { Loader2, Users, UserCircle, Building } from "lucide-react";

const Admin = () => {
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

  const tradesmen = profiles?.filter(p => p.user_type === 'tradesman').length || 0;
  const customers = profiles?.filter(p => p.user_type === 'customer').length || 0;
  const merchants = profiles?.filter(p => p.user_type === 'merchant').length || 0;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Statistics</h1>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-medium mb-1">Total Users</h3>
              <p className="text-3xl font-bold">{profiles?.length || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <UserCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-medium mb-1">Tradesmen</h3>
              <p className="text-3xl font-bold">{tradesmen}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-medium mb-1">Customers</h3>
              <p className="text-3xl font-bold">{customers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <Building className="h-8 w-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-medium mb-1">Merchants</h3>
              <p className="text-3xl font-bold">{merchants}</p>
            </div>
          </div>
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
                      <Badge 
                        variant={
                          profile.user_type === "tradesman" 
                            ? "default" 
                            : profile.user_type === "merchant"
                            ? "destructive"
                            : "secondary"
                        }
                      >
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