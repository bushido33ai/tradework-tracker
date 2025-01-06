import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobsList from "@/components/jobs/JobsList";
import AddJobDialog from "@/components/jobs/AddJobDialog";

const Jobs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage your jobs and track their progress
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      <JobsList status={["pending", "in_progress", "completed", "cancelled"]} />
      
      <AddJobDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default Jobs;