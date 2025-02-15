
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { DaysWorkedForm } from "./DaysWorkedForm";
import { Loader2 } from "lucide-react";

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
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Days Worked</h3>
            <p className="text-sm text-muted-foreground">
              Total Hours: {totalHours}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Cost: £{totalCost.toFixed(2)}
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Days"}
          </Button>
        </div>

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

        {daysWorked && daysWorked.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Day Rate</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daysWorked.map((day) => (
                  <TableRow key={day.id}>
                    <TableCell>{format(new Date(day.date_worked), "PPP")}</TableCell>
                    <TableCell>{day.hours_worked}</TableCell>
                    <TableCell className="capitalize">{day.day_rate_type || "N/A"}</TableCell>
                    <TableCell>£{day.day_rate ? day.day_rate.toFixed(2) : "N/A"}</TableCell>
                    <TableCell>{day.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(day.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-sm text-muted-foreground text-right pt-4">
              Total Days Worked: {totalDays}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No days worked recorded yet
          </p>
        )}
      </div>

      <AlertDialog open={Boolean(deletingId)} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected day worked entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingId) {
                  handleDelete(deletingId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
