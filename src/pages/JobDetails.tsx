import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import JobHeader from "@/components/jobs/details/JobHeader";
import JobContent from "@/components/jobs/details/JobContent";
import JobTabs from "@/components/jobs/details/JobTabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormValues } from "@/components/jobs/types";
import { EditJobDialog } from "@/components/jobs/details/EditJobDialog";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      budget: "",
    },
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Set form values when job data is loaded
  React.useEffect(() => {
    if (job) {
      form.reset({
        title: job.title,
        description: job.description,
        location: job.location,
        budget: job.budget?.toString() || "",
      });
    }
  }, [job, form]);

  const updateJobMutation = useMutation({
    mutationFn: async (values: JobFormValues) => {
      const { error } = await supabase
        .from("jobs")
        .update({
          title: values.title,
          description: values.description,
          location: values.location,
          budget: values.budget ? parseFloat(values.budget) : null,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job updated successfully");
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      setShowEditDialog(false);
    },
    onError: (error) => {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/jobs");
    },
    onError: (error) => {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    },
  });

  const completeJobMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("jobs")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job marked as completed");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["currentJobs"] });
      navigate("/jobs");
    },
    onError: (error) => {
      console.error("Error completing job:", error);
      toast.error("Failed to complete job");
    },
  });

  if (isLoading) {
    return <div>Loading job details...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      <Card>
        <JobHeader
          jobNumber={job.job_number}
          title={job.title}
          status={job.status}
          onComplete={() => completeJobMutation.mutate()}
          onDelete={() => deleteJobMutation.mutate()}
          onEdit={() => setShowEditDialog(true)}
          isCompletePending={completeJobMutation.isPending}
          isDeletePending={deleteJobMutation.isPending}
        />
        <JobContent
          description={job.description}
          location={job.location}
          budget={job.budget}
        />
      </Card>

      <JobTabs jobId={job.id} budget={job.budget} />

      <EditJobDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        form={form}
        updateJobMutation={updateJobMutation}
      />
    </div>
  );
};

export default JobDetails;