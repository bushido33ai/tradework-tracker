import { useState } from "react";
import { Plus } from "lucide-react";
import JobsList from "@/components/jobs/JobsList";
import AddJobDialog from "@/components/jobs/AddJobDialog";
import { Separator } from "@/components/ui/separator";
import { RainbowButton } from "@/components/ui/rainbow-button";

const Jobs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage your jobs and track their progress
          </p>
        </div>
        <RainbowButton onClick={() => setShowAddDialog(true)}>
          <span className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </span>
        </RainbowButton>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Jobs</h2>
          <JobsList status={["pending", "in_progress"]} />
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Completed Jobs</h2>
          <JobsList status={["completed"]} />
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