
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MerchantTraders = () => {
  const navigate = useNavigate();

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
      <div className="grid gap-4">
        {traders?.map((trader) => (
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
        {traders?.length === 0 && (
          <p className="text-muted-foreground">No traders found.</p>
        )}
      </div>
    </div>
  );
};

export default MerchantTraders;
