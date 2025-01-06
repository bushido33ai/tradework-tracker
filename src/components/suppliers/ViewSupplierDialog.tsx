import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SupplierFormFields from "./SupplierFormFields";
import { supplierSchema, type SupplierFormValues } from "./types";

interface ViewSupplierDialogProps {
  supplier: {
    id: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    business_type: string;
    status: "active" | "inactive";
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewSupplierDialog = ({ supplier, open, onOpenChange }: ViewSupplierDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      company_name: supplier.company_name,
      contact_name: supplier.contact_name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      business_type: supplier.business_type,
    },
  });

  const updateSupplier = useMutation({
    mutationFn: async (values: SupplierFormValues) => {
      const { error } = await supabase
        .from("suppliers")
        .update({
          company_name: values.company_name,
          contact_name: values.contact_name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          business_type: values.business_type,
        })
        .eq("id", supplier.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update supplier: " + error.message);
    },
  });

  const onSubmit = (values: SupplierFormValues) => {
    updateSupplier.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
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
              <Button type="submit" disabled={updateSupplier.isPending}>
                {updateSupplier.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSupplierDialog;