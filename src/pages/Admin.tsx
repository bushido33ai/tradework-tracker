import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Loader2 } from "lucide-react";

const Admin = () => {
  // Fetch all profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log("Fetching profiles...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Fetched profiles:", data);
      return data || [];
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
      <h1 className="text-3xl font-bold mb-8 text-center">User Statistics</h1>
      
      <div className="max-w-md mx-auto">
        <Card className="p-8 bg-white">
          <div className="flex items-center justify-center gap-4">
            <Users className="h-12 w-12 text-blue-500" />
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-blue-600">
                {profiles?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;