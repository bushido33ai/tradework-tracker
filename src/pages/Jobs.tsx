import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobsList from "@/components/jobs/JobsList";
import AddJobDialog from "@/components/jobs/AddJobDialog";
import { Separator } from "@/components/ui/separator";

const Jobs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="container mx-auto px-4 space-y-8 max-w-5xl">
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