import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface JobExtra {
  id: string;
  description: string;
  amount: number;
  created_at: string;
  created_by: string;
}

interface ExtrasListProps {
  jobId: string;
}

export const ExtrasList = ({ jobId }: ExtrasListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: extras, isLoading } = useQuery({
    queryKey: ["extras", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_extras")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as JobExtra[];
    },
  });

  const deleteExtra = useMutation({
    mutationFn: async (extraId: string) => {
      const { error } = await supabase
        .from("job_extras")
        .delete()
        .eq("id", extraId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extras", jobId] });
      toast({
        title: "Success",
        description: "Extra deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting extra:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete extra",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!extras || extras.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No extras added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {extras.map((extra) => (
        <div
          key={extra.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex-1">
            <p className="font-medium">{extra.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(extra.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-semibold">£{Number(extra.amount).toFixed(2)}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Extra</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this extra? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteExtra.mutate(extra.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};
