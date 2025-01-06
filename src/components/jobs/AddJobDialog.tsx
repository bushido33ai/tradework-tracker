import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import JobFormFields from "./JobFormFields";
import { jobSchema, type JobFormValues } from "./types";

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddJobDialog = ({ open, onOpenChange }: AddJobDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      budget: "",
    },
  });

  const addJob = useMutation({
    mutationFn: async (values: JobFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const jobData = {
        title: values.title,
        description: values.description,
        location: values.location,
        budget: values.budget ? parseFloat(values.budget) : null,
        created_by: user.id,
      };

      const { error } = await supabase.from("jobs").insert(jobData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      form.reset();
      onOpenChange(false);
      toast.success("Job created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create job: " + error.message);
    },
  });

  const onSubmit = (values: JobFormValues) => {
    addJob.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <JobFormFields form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addJob.isPending}>
                {addJob.isPending ? "Creating..." : "Create Job"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;