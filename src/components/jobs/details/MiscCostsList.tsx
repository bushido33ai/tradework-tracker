
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import type { JobMiscCost } from "./types";

interface MiscCostsListProps {
  jobId: string;
}

export const MiscCostsList = ({ jobId }: MiscCostsListProps) => {
  const queryClient = useQueryClient();

  const { data: miscCosts, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!miscCosts?.length) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No miscellaneous costs recorded
      </p>
    );
  }

  return (
    <div className="space-y-2">
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
  );
};
