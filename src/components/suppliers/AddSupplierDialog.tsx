import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import SupplierFormFields from "./SupplierFormFields";
import { supplierSchema, type SupplierFormValues, type SupplierInsert } from "./types";

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddSupplierDialog = ({ open, onOpenChange }: AddSupplierDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      business_type: "",
    },
  });

  const addSupplier = useMutation({
    mutationFn: async (values: SupplierFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the supplier insert object with all required fields
      const supplierData: SupplierInsert = {
        ...values,
        created_by: user.id,
        status: "active",
      };

      const { error } = await supabase.from("suppliers").insert(supplierData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier added successfully");
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to add supplier: " + error.message);
    },
  });

  const onSubmit = (values: SupplierFormValues) => {
    addSupplier.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SupplierFormFields form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addSupplier.isPending}>
                {addSupplier.isPending ? "Adding..." : "Add Supplier"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierDialog;