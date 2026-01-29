
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useProfile } from "@/hooks/useProfile";

interface TradesmanProfile {
  id: string;
  first_name: string | null;
  surname: string | null;
  full_name: string | null;
  email: string | null;
  telephone: string | null;
  address: string | null;
}

const MerchantTraders = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { data: profile, isLoading: profileLoading } = useProfile(session?.user?.id);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is a merchant - redirect if not
  const isMerchant = profile?.user_type === 'merchant';

  const { data: traders, isLoading: tradersLoading } = useQuery({
    queryKey: ["tradesman-directory"],
    queryFn: async () => {
      // Use the secure RPC function that enforces merchant-only access
      const { data, error } = await supabase
        .rpc('get_tradesman_directory');

      if (error) {
        console.error("Error fetching tradesman directory:", error);
        throw error;
      }
      return data as TradesmanProfile[];
    },
    enabled: isMerchant, // Only run query if user is a merchant
  });

  const filteredTraders = traders?.filter((trader) => {
    const searchTerm = searchQuery.toLowerCase();
    const fullName = trader.first_name && trader.surname 
      ? `${trader.first_name} ${trader.surname}`.toLowerCase()
      : (trader.full_name || "").toLowerCase();
    const email = (trader.email || "").toLowerCase();
    const phone = (trader.telephone || "").toLowerCase();

    return (
      fullName.includes(searchTerm) ||
      email.includes(searchTerm) ||
      phone.includes(searchTerm)
    );
  });

  // Show loading while checking profile
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect non-merchants to dashboard
  if (!isMerchant) {
    return <Navigate to="/dashboard" replace />;
  }

  if (tradersLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Traders Directory</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search traders by name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredTraders?.map((trader) => (
          <Card 
            key={trader.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => navigate(`/merchant/traders/${trader.id}/jobs`)}
          >
            <h3 className="text-xl font-semibold">
              {trader.first_name && trader.surname 
                ? `${trader.first_name} ${trader.surname}`
                : trader.full_name || trader.email}
            </h3>
            {trader.telephone && (
              <p className="text-muted-foreground mt-2">📞 {trader.telephone}</p>
            )}
            {trader.address && (
              <p className="text-muted-foreground">📍 {trader.address}</p>
            )}
          </Card>
        ))}
        {filteredTraders?.length === 0 && (
          <p className="text-muted-foreground">No traders found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default MerchantTraders;
