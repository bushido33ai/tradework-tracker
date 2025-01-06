import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AddSupplierDialog from "@/components/suppliers/AddSupplierDialog";
import SuppliersList from "@/components/suppliers/SuppliersList";

const Suppliers = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("company_name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground mt-2">
            Manage your suppliers and their information
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2" />
          Add Supplier
        </Button>
      </div>

      <SuppliersList suppliers={suppliers || []} isLoading={isLoading} />
      
      <AddSupplierDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Suppliers;