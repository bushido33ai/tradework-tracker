import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AddCustomerDialog from "@/components/customers/AddCustomerDialog";

const Customers = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'customer');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid gap-4">
        {profiles?.map((profile) => (
          <div
            key={profile.id}
            className="p-4 bg-white rounded-lg shadow border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{profile.id}</h3>
                <p className="text-sm text-gray-500">{profile.telephone}</p>
                <p className="text-sm text-gray-500">{profile.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCustomerDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};

export default Customers;