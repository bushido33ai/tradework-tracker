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

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCustomerDialog = ({ open, onOpenChange }: AddCustomerDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      telephone: "",
      address: "",
      preferredContactMethod: "",
      notes: "",
    },
  });

  const addCustomer = useMutation({
    mutationFn: async (values: CustomerFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create a profile entry for the customer
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_type: 'customer',
          full_name: values.fullName,
          email: values.email,
          telephone: values.telephone,
          address: values.address,
          preferred_contact_method: values.preferredContactMethod,
          notes: values.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.reset();
      onOpenChange(false);
      toast.success("Customer added successfully");
    },
    onError: (error) => {
      console.error('Error adding customer:', error);
      toast.error("Failed to add customer: " + error.message);
    },
  });

  const onSubmit = (values: CustomerFormValues) => {
    addCustomer.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
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
              <Button type="submit" disabled={addCustomer.isPending}>
                {addCustomer.isPending ? "Adding..." : "Add Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;