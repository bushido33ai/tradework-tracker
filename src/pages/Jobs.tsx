
import { useState } from "react";
import { Plus } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import JobsList from "@/components/jobs/JobsList";
import AddJobDialog from "@/components/jobs/AddJobDialog";
import { Separator } from "@/components/ui/separator";
import { GradientButton } from "@/components/ui/gradient-button";

const Jobs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { session } = useSessionContext();
  const { data: isAdmin } = useAdminRole(session?.user?.id);

  // If not admin, pass the current user's ID to filter jobs
  const userId = !isAdmin ? session?.user?.id : undefined;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage your jobs and track their progress
          </p>
        </div>
        <GradientButton onClick={() => setShowAddDialog(true)}>
          <span className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </span>
        </GradientButton>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Jobs</h2>
          <JobsList status={["pending", "in_progress"]} userId={userId} />
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Completed Jobs</h2>
          <JobsList status={["completed"]} userId={userId} />
        </div>
      </div>
      
      <AddJobDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default Jobs;
