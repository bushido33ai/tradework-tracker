import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/ui/gradient-button";

interface ExtrasFormValues {
  description: string;
  amount: number;
}

interface ExtrasFormProps {
  jobId: string;
  onSuccess: () => void;
}

const ExtrasForm = ({ jobId, onSuccess }: ExtrasFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ExtrasFormValues>({
    defaultValues: {
      description: "",
      amount: 0,
    },
  });

  const addExtra = useMutation({
    mutationFn: async (values: ExtrasFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("job_extras")
        .insert({
          job_id: jobId,
          description: values.description,
          amount: values.amount,
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extras", jobId] });
      toast({
        title: "Success",
        description: "Extra added successfully",
      });
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      console.error("Error adding extra:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add extra",
      });
    },
  });

  const onSubmit = (values: ExtrasFormValues) => {
    if (values.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Amount must be greater than 0",
      });
      return;
    }
    addExtra.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (£)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <GradientButton type="submit" disabled={addExtra.isPending}>
          {addExtra.isPending ? "Adding..." : "Add Extra"}
        </GradientButton>
      </form>
    </Form>
  );
};

export default ExtrasForm;
