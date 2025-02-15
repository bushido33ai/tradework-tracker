
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
import { useIsMobile } from "@/hooks/use-mobile";

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddJobDialog = ({ open, onOpenChange }: AddJobDialogProps) => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      budget: "",
      start_date: new Date().toISOString(),
      job_type: "Fully Quoted",
      job_manager: "",
    },
  });

  const addJob = useMutation({
    mutationFn: async (values: JobFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("Submitting job with values:", values);

      const jobData = {
        title: values.title,
        description: values.description,
        location: values.location,
        budget: values.budget ? parseFloat(values.budget) : null,
        created_by: user.id,
        start_date: values.start_date,
        job_manager: user.id,
        job_type: values.job_type,
      };

      const { error, data } = await supabase
        .from("jobs")
        .insert(jobData)
        .select()
        .single();

      if (error) {
        console.error("Error details:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      form.reset();
      onOpenChange(false);
      toast.success("Job created successfully");
    },
    onError: (error) => {
      console.error("Error creating job:", error);
      toast.error("Failed to create job: " + error.message);
    },
  });

  const onSubmit = async (values: JobFormValues) => {
    console.log("Form submitted with values:", values);
    try {
      await addJob.mutateAsync(values);
    } catch (error) {
      console.error("Error in submit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`sm:max-w-[500px] ${isMobile ? 'h-[90vh] !max-h-[90vh]' : ''}`}
        style={{
          overflowY: isMobile ? 'auto' : undefined,
          paddingBottom: isMobile ? '80px' : undefined // Add padding to ensure the bottom is visible
        }}
      >
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            <JobFormFields form={form} />

            <div className={`flex justify-end gap-4 pt-4 ${isMobile ? 'sticky bottom-0 bg-background p-4 border-t' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addJob.isPending}
              >
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
