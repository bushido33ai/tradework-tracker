
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";
import BudgetChart from "@/components/jobs/BudgetChart";
import JobNotes from "./JobNotes";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import type { JobMiscCost } from "./types";

interface JobTabsProps {
  jobId: string;
  budget: number | null;
}

interface MiscCostFormValues {
  description: string;
  amount: string;
}

const JobTabs = ({ jobId, budget }: JobTabsProps) => {
  const queryClient = useQueryClient();
  const [showMiscCostForm, setShowMiscCostForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<MiscCostFormValues>();

  const { data: miscCosts, isLoading: isLoadingMiscCosts } = useQuery({
    queryKey: ["miscCosts", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_misc_costs")
        .select("*")
        .eq("job_id", jobId)
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
      setShowMiscCostForm(false);
    },
    onError: (error) => {
      console.error("Error adding misc cost:", error);
      toast.error("Failed to add cost");
    },
  });

  const deleteMiscCost = useMutation({
    mutationFn: async (costId: string) => {
      const { error } = await supabase
        .from("job_misc_costs")
        .delete()
        .eq("id", costId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["miscCosts", jobId] });
      toast.success("Cost deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting misc cost:", error);
      toast.error("Failed to delete cost");
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
    <Tabs defaultValue="designs" className="w-full">
      <TabsList className="w-full flex bg-white/90 backdrop-blur-sm border-b">
        <TabsTrigger 
          value="designs" 
          className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800"
        >
          Designs
        </TabsTrigger>
        <TabsTrigger 
          value="invoices" 
          className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800"
        >
          Invoices
        </TabsTrigger>
        <TabsTrigger 
          value="notes" 
          className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800"
        >
          Notes
        </TabsTrigger>
        {budget && budget > 0 && (
          <TabsTrigger 
            value="budget" 
            className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800"
          >
            Budget
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="designs">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <GradientButton asChild>
                <div>
                  <FileUpload jobId={jobId} type="design" />
                </div>
              </GradientButton>
            </div>
            <FileList jobId={jobId} type="design" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="invoices">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <h4 className="font-medium">Miscellaneous Costs</h4>
                <RainbowButton
                  onClick={() => setShowMiscCostForm(!showMiscCostForm)}
                >
                  {showMiscCostForm ? "Cancel" : "Add Cost"}
                </RainbowButton>
              </div>
              <GradientButton asChild>
                <div>
                  <FileUpload jobId={jobId} type="invoice" />
                </div>
              </GradientButton>
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
            )}

            {isLoadingMiscCosts ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : miscCosts && miscCosts.length > 0 ? (
              <div className="space-y-2 mb-4">
                {miscCosts.map((cost) => (
                  <div 
                    key={cost.id} 
                    className="flex justify-between items-center p-3 bg-accent/50 rounded-lg group"
                  >
                    <span>{cost.description}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">£{cost.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this cost?')) {
                            deleteMiscCost.mutate(cost.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 mb-4">
                No miscellaneous costs recorded
              </p>
            )}

            <FileList jobId={jobId} type="invoice" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <JobNotes jobId={jobId} />
          </div>
        </Card>
      </TabsContent>

      {budget && budget > 0 && (
        <TabsContent value="budget">
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <BudgetChart jobId={jobId} budget={budget} />
            </div>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default JobTabs;
