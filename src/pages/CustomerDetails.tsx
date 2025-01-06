import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CustomerFormFields from "@/components/customers/CustomerFormFields";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormValues, customerSchema } from "@/components/customers/types";
import { toast } from "sonner";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Set form values after data is fetched
      form.reset({
        fullName: data.full_name,
        email: data.email,
        telephone: data.telephone,
        address: data.address,
        preferredContactMethod: data.preferred_contact_method,
        notes: data.notes,
      });
      
      return data;
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const { error } = await supabase
        .from('customer_profiles')
        .update({
          full_name: values.fullName,
          email: values.email,
          telephone: values.telephone,
          address: values.address,
          preferred_contact_method: values.preferredContactMethod,
          notes: values.notes,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Customer details updated successfully");
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error("Failed to update customer details");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomerFormFields form={form} />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomerDetails;