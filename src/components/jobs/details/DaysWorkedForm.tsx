
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  date_worked: z.string().min(1, "Date is required"),
  hours_worked: z.string().min(1, "Hours worked is required"),
  day_rate_type: z.enum(["labourer", "skilled"], {
    required_error: "Day rate type is required",
  }),
  day_rate: z.string().min(1, "Day rate is required"),
  notes: z.string().optional(),
});

interface DaysWorkedFormProps {
  jobId: string;
  onSuccess: () => void;
}

export const DaysWorkedForm = ({ jobId, onSuccess }: DaysWorkedFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_worked: new Date().toISOString().split("T")[0],
      hours_worked: "8",
      day_rate_type: "labourer",
      day_rate: "",
      notes: "",
    },
  });

  const addDaysWorked = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase.from("job_days_worked").insert({
        job_id: jobId,
        date_worked: values.date_worked,
        hours_worked: parseFloat(values.hours_worked),
        day_rate: parseFloat(values.day_rate),
        day_rate_type: values.day_rate_type,
        notes: values.notes,
      });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Days worked added successfully");
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      console.error("Error adding days worked:", error);
      toast.error("Failed to add days worked");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addDaysWorked.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date_worked"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hours_worked"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hours Worked</FormLabel>
              <FormControl>
                <Input type="number" step="0.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="day_rate_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day Rate Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day rate type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="labourer">Labourer</SelectItem>
                  <SelectItem value="skilled">Skilled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="day_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day Rate (£)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Enter day rate amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={addDaysWorked.isPending}>
          {addDaysWorked.isPending ? "Adding..." : "Add Days"}
        </Button>
      </form>
    </Form>
  );
};
