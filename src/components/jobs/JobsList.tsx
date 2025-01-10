import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type JobStatus = "pending" | "in_progress" | "completed" | "cancelled";

interface JobsListProps {
  status: JobStatus[];
}

const JobsList = ({ status }: JobsListProps) => {
  const navigate = useNavigate();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .in("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading jobs...</div>;
  }

  if (!jobs?.length) {
    return <div className="text-muted-foreground">No jobs found.</div>;
  }

  return (
    <div className="grid gap-4 mt-4">
      {jobs.map((job) => (
        <Card 
          key={job.id} 
          className="p-4 cursor-pointer bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600"
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {job.job_number}
              </div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-muted-foreground mt-1">{job.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>📍 {job.location}</span>
                {job.budget && <span>💰 £{job.budget}</span>}
              </div>
            </div>
            <Badge
              variant={
                job.status === "completed"
                  ? "default"
                  : job.status === "cancelled"
                  ? "destructive"
                  : "secondary"
              }
              className={job.status === "pending" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {job.status === "pending" ? "current" : job.status.replace("_", " ")}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default JobsList;