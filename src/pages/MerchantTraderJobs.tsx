
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import MerchantJobCard from "@/components/jobs/merchant/MerchantJobCard";

const MerchantTraderJobs = () => {
  const { traderId } = useParams();
  const navigate = useNavigate();

  const { data: trader, isLoading: traderLoading } = useQuery({
    queryKey: ["trader", traderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", traderId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["trader-jobs", traderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, job_number, title")
        .eq("created_by", traderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (traderLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/merchant/traders")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Traders
        </Button>
        <h1 className="text-3xl font-bold">
          Jobs from {trader?.full_name || trader?.email}
        </h1>
      </div>

      <div className="space-y-4">
        {jobs?.map((job) => (
          <MerchantJobCard key={job.id} job={job} />
        ))}
        {jobs?.length === 0 && (
          <p className="text-center text-muted-foreground">No jobs found for this trader.</p>
        )}
      </div>
    </div>
  );
};

export default MerchantTraderJobs;
