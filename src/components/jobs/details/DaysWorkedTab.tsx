
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DaysWorkedForm } from "./DaysWorkedForm";
import { DaysWorkedStats } from "./days-worked/DaysWorkedStats";
import { DaysWorkedTable } from "./days-worked/DaysWorkedTable";
import { DeleteDayWorkedDialog } from "./days-worked/DeleteDayWorkedDialog";
import { Button } from "@/components/ui/button";

interface DaysWorkedTabProps {
  jobId: string;
}

export const DaysWorkedTab = ({ jobId }: DaysWorkedTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: daysWorked, isLoading } = useQuery({
    queryKey: ["job-days-worked", jobId],
    queryFn: async () => {
      console.log("Fetching days worked for job:", jobId);
      const { data, error } = await supabase
        .from("job_days_worked")
        .select("*")
        .eq("job_id", jobId)
        .order("date_worked", { ascending: false });

      if (error) {
        console.error("Error fetching days worked:", error);
        throw error;
      }
      
      console.log("Days worked data:", data);
      return data;
    },
  });

  const deleteDayWorked = useMutation({
    mutationFn: async (id: string) => {
      console.log("Attempting to delete day worked with ID:", id);
      const { error } = await supabase
        .from("job_days_worked")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error in delete operation:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      console.log("Successfully deleted day worked. Invalidating queries...");
      queryClient.invalidateQueries({
        queryKey: ["job-days-worked", jobId],
      });
      queryClient.invalidateQueries({
        queryKey: ["job-total-costs", jobId],
      });
      toast.success("Entry deleted successfully");
      setDeletingId(null);
    },
    onError: (error) => {
      console.error("Error deleting day worked:", error);
      toast.error("Failed to delete entry. You can only delete entries you created.");
      setDeletingId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalHours = daysWorked?.reduce((sum, day) => sum + Number(day.hours_worked), 0) || 0;
  const totalDays = daysWorked?.length || 0;
  const totalCost = daysWorked?.reduce((sum, day) => {
    const dayRate = Number(day.day_rate) || 0;
    return sum + dayRate;
  }, 0) || 0;

  const handleDelete = async (id: string) => {
    console.log("Delete requested for day worked ID:", id);
    deleteDayWorked.mutate(id);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <DaysWorkedStats
          totalHours={totalHours}
          totalCost={totalCost}
          showForm={showForm}
          onToggleForm={() => setShowForm(!showForm)}
        />

        {showForm && (
          <DaysWorkedForm
            jobId={jobId}
            onSuccess={() => {
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ["job-days-worked", jobId] });
              queryClient.invalidateQueries({ queryKey: ["job-total-costs", jobId] });
            }}
          />
        )}

        <DaysWorkedTable
          daysWorked={daysWorked || []}
          totalDays={totalDays}
          onDeleteClick={(id) => setDeletingId(id)}
        />

        <DeleteDayWorkedDialog
          isOpen={Boolean(deletingId)}
          onClose={() => setDeletingId(null)}
          onConfirm={() => {
            if (deletingId) {
              handleDelete(deletingId);
            }
          }}
        />
      </div>
    </Card>
  );
};
