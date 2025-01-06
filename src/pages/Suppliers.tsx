import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold break-words">Suppliers</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base break-words">
            Manage your suppliers and their information
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
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