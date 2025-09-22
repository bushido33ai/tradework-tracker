import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  payment_date: z.date(),
  description: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export const PaymentForm = ({ jobId, onSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      payment_date: new Date(),
      description: "",
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      const { error } = await supabase.from("job_payments").insert({
        job_id: jobId,
        amount: parseFloat(values.amount),
        payment_date: values.payment_date.toISOString().split('T')[0],
        description: values.description || null,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Payment recorded",
        description: "Payment has been successfully recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-payments"] });
      queryClient.invalidateQueries({ queryKey: ["totalReceived"] });
      queryClient.invalidateQueries({ queryKey: ["currentJobs"] });
      queryClient.invalidateQueries({ queryKey: ["completedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["totalSpend"] });
      queryClient.invalidateQueries({ queryKey: ["totalInvoices"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating payment:", error);
    },
  });

  const onSubmit = async (values: PaymentFormValues) => {
    setIsSubmitting(true);
    await createPaymentMutation.mutateAsync(values);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (£)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Payment description..."
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Recording..." : "Record Payment"}
        </Button>
      </form>
    </Form>
  );
};