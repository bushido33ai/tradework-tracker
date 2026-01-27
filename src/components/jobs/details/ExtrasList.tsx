import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  const totalExtras = extras?.reduce((sum, extra) => sum + Number(extra.amount), 0) ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Extras Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">Total Extras</h3>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            £{totalExtras.toFixed(2)}
          </p>
        </div>
      </Card>

      {/* Extras List */}
      {!extras || extras.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No extras added yet
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {extras.map((extra) => (
            <Card key={extra.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg">
                      £{Number(extra.amount).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(extra.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {extra.description}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
