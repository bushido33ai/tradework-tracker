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
import CustomerFormFields from "./CustomerFormFields";
import { customerSchema, type CustomerFormValues } from "./types";

interface ViewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: {
    id: string;
    full_name: string;
    email: string;
    telephone: string;
    address: string;
    preferred_contact_method: string;
    notes: string | null;
  };
}

const ViewCustomerDialog = ({ open, onOpenChange, customer }: ViewCustomerDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: customer.full_name,
      email: customer.email,
      telephone: customer.telephone,
      address: customer.address,
      preferredContactMethod: customer.preferred_contact_method,
      notes: customer.notes || "",
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async (values: CustomerFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('customer_profiles')
        .update({
          full_name: values.fullName,
          email: values.email,
          telephone: values.telephone,
          address: values.address,
          preferred_contact_method: values.preferredContactMethod,
          notes: values.notes,
        })
        .eq('id', customer.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onOpenChange(false);
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      toast.error("Failed to update customer");
    },
  });

  const onSubmit = (values: CustomerFormValues) => {
    updateCustomer.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomerFormFields form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCustomer.isPending}>
                {updateCustomer.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerDialog;