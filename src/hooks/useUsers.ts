
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserWithDetails {
  id: string;
  full_name: string | null;
  email: string | null;
  user_type: string | null;
  jobCount: number;
  isAdmin: boolean;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      console.log("Fetching users with job counts and admin status...");
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      const usersWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          const { count: jobCount, error: jobsError } = await supabase
            .from("jobs")
            .select("*", { count: 'exact', head: true })
            .eq("created_by", profile.id);

          if (jobsError) {
            console.error("Error fetching job count:", jobsError);
            return { ...profile, jobCount: 0, isAdmin: false };
          }

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
      return usersWithDetails as UserWithDetails[];
    },
  });
};
