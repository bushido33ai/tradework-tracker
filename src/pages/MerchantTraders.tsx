
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MerchantTraders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: traders, isLoading } = useQuery({
    queryKey: ["traders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "tradesman");

      if (error) throw error;
      return data;
    },
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

  if (isLoading) {
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
