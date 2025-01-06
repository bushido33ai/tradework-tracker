import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) {
        console.log("useProfile: No user ID provided");
        throw new Error("No user ID provided");
      }
      
      console.log("useProfile: Fetching profile for user", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        throw error;
      }

      if (!data) {
        console.log("useProfile: No profile found for user", userId);
        toast.error("Profile not found");
        throw new Error("Profile not found");
      }

      console.log("useProfile: Profile loaded successfully", data);
      return data;
    },
    enabled: !!userId,
  });
};