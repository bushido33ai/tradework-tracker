
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FileUpload from "@/components/jobs/FileUpload";
import JobNotes from "@/components/jobs/details/JobNotes";
import FileList from "@/components/jobs/FileList";
import type { JobMiscCost } from "@/components/jobs/details/types";

interface MerchantJobCardProps {
  job: {
    id: string;
    job_number: string;
    title: string;
  };
}

interface MiscCostFormValues {
  description: string;
  amount: string;
}

const MerchantJobCard = ({ job }: MerchantJobCardProps) => {
  const queryClient = useQueryClient();
  const [showMiscCostForm, setShowMiscCostForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<MiscCostFormValues>();

  const { data: miscCosts, isLoading: isLoadingMiscCosts } = useQuery({
    queryKey: ["miscCosts", job.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_misc_costs")
        .select("*")
        .eq("job_id", job.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as JobMiscCost[];
    },
  });

  const addMiscCost = useMutation({
    mutationFn: async (values: MiscCostFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("job_misc_costs")
        .insert({
          job_id: job.id,
          description: values.description,
          amount: parseFloat(values.amount),
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["miscCosts", job.id] });
      toast.success("Cost added successfully");
      reset();
      setShowMiscCostForm(false);
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
    <Card className="mb-4">
      <CardHeader className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground">{job.job_number}</div>
        <h3 className="text-xl font-semibold">{job.title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Invoices</h4>
          <FileUpload jobId={job.id} type="invoice" />
          <div className="mt-2">
            <FileList jobId={job.id} type="invoice" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Miscellaneous Costs</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMiscCostForm(!showMiscCostForm)}
            >
              {showMiscCostForm ? "Cancel" : "Add Cost"}
            </Button>
          </div>

          {showMiscCostForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
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
              <Button 
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
              </Button>
            </form>
          )}

          {isLoadingMiscCosts ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : miscCosts && miscCosts.length > 0 ? (
            <div className="space-y-2">
              {miscCosts.map((cost) => (
                <div 
                  key={cost.id} 
                  className="flex justify-between items-center p-3 bg-accent/50 rounded-lg"
                >
                  <span>{cost.description}</span>
                  <span className="font-medium">£{cost.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No miscellaneous costs recorded
            </p>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Notes</h4>
          <JobNotes jobId={job.id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantJobCard;
