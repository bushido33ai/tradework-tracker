import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";
import BudgetChart from "@/components/jobs/BudgetChart";
import { CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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

  const handleCompleteJob = () => {
    completeJobMutation.mutate();
  };

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      <Card>
        <CardHeader className="space-y-4 md:space-y-0 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl md:text-2xl">{job.title}</CardTitle>
          {job.status !== "completed" && job.status !== "cancelled" && (
            <Button
              onClick={handleCompleteJob}
              className="bg-green-500 hover:bg-green-600 w-full md:w-auto"
              disabled={completeJobMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {completeJobMutation.isPending ? "Completing..." : "Mark as Complete"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground mt-1">{job.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>📍 {job.location}</span>
              {job.budget && <span>💰 ${job.budget}</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="designs" className="w-full">
        <TabsList className="w-full flex">
          <TabsTrigger value="designs" className="flex-1">Designs</TabsTrigger>
          <TabsTrigger value="invoices" className="flex-1">Invoices</TabsTrigger>
          {job.budget > 0 && <TabsTrigger value="budget" className="flex-1">Budget</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="designs">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end mb-4">
                <FileUpload jobId={job.id} type="design" />
              </div>
              <FileList jobId={job.id} type="design" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end mb-4">
                <FileUpload jobId={job.id} type="invoice" />
              </div>
              <FileList jobId={job.id} type="invoice" />
            </CardContent>
          </Card>
        </TabsContent>

        {job.budget > 0 && (
          <TabsContent value="budget">
            <Card>
              <CardContent className="pt-6">
                <BudgetChart jobId={job.id} budget={job.budget} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default JobDetails;