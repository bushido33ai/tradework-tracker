import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";
import BudgetChart from "@/components/jobs/BudgetChart";

const JobDetails = () => {
  const { id } = useParams();

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

  if (isLoading) {
    return <div>Loading job details...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground mt-1">{job.description}</p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>📍 {job.location}</span>
              {job.budget && <span>💰 ${job.budget}</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="designs" className="w-full">
        <TabsList>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          {job.budget > 0 && <TabsTrigger value="budget">Budget</TabsTrigger>}
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