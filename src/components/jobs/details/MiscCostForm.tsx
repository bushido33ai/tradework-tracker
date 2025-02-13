
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/ui/gradient-button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface MiscCostFormValues {
  description: string;
  amount: string;
}

interface MiscCostFormProps {
  jobId: string;
  onSuccess: () => void;
}

export const MiscCostForm = ({ jobId, onSuccess }: MiscCostFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<MiscCostFormValues>();

  const addMiscCost = useMutation({
    mutationFn: async (values: MiscCostFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("job_misc_costs")
        .insert({
          job_id: jobId,
          description: values.description,
          amount: parseFloat(values.amount),
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["miscCosts", jobId] });
      toast.success("Cost added successfully");
      reset();
      onSuccess();
    },
    onError: (error) => {
      console.error("Error adding misc cost:", error);
      toast.error("Failed to add cost");
    },
  });

  const onSubmit = (values: MiscCostFormValues) => {
    if (!values.amount || isNaN(parseFloat(values.amount))) {
      toast.error("Please enter a valid amount");
      return;
    }
    addMiscCost.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Description"
        {...register("description", { required: true })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Amount"
        {...register("amount", { required: true })}
      />
      <GradientButton 
        type="submit" 
        disabled={addMiscCost.isPending}
        className="w-full"
      >
        {addMiscCost.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Cost"
        )}
      </GradientButton>
    </form>
  );
};
