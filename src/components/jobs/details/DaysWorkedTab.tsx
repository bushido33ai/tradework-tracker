
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
import { format } from "date-fns";
import { toast } from "sonner";
import { DaysWorkedForm } from "./DaysWorkedForm";
import { Loader2 } from "lucide-react";

interface DaysWorkedTabProps {
  jobId: string;
}

export const DaysWorkedTab = ({ jobId }: DaysWorkedTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: daysWorked, isLoading } = useQuery({
    queryKey: ["job-days-worked", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_days_worked")
        .select("*")
        .eq("job_id", jobId)
        .order("date_worked", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteDayWorked = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("job_days_worked")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-days-worked", jobId] });
      toast.success("Entry deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete entry");
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Days Worked</h3>
            <p className="text-sm text-muted-foreground">
              Total Hours: {totalHours}
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
                    <TableCell>{day.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDayWorked.mutate(day.id)}
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
    </Card>
  );
};
