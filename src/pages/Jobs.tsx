import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import JobsList from "@/components/jobs/JobsList";

const Jobs = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/jobs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="current">Current Jobs</TabsTrigger>
          <TabsTrigger value="history">Job History</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <JobsList status={["pending", "in_progress"]} />
        </TabsContent>
        <TabsContent value="history">
          <JobsList status={["completed", "cancelled"]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;