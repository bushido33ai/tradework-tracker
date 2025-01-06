import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";
import BudgetChart from "@/components/jobs/BudgetChart";
import JobNotes from "./JobNotes";

interface JobTabsProps {
  jobId: string;
  budget: number | null;
}

const JobTabs = ({ jobId, budget }: JobTabsProps) => {
  return (
    <Tabs defaultValue="designs" className="w-full">
      <TabsList className="w-full flex">
        <TabsTrigger value="designs" className="flex-1">Designs</TabsTrigger>
        <TabsTrigger value="invoices" className="flex-1">Invoices</TabsTrigger>
        <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
        {budget && budget > 0 && (
          <TabsTrigger value="budget" className="flex-1">Budget</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="designs">
        <Card>
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <FileUpload jobId={jobId} type="design" />
            </div>
            <FileList jobId={jobId} type="design" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="invoices">
        <Card>
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <FileUpload jobId={jobId} type="invoice" />
            </div>
            <FileList jobId={jobId} type="invoice" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card>
          <div className="p-6">
            <JobNotes jobId={jobId} />
          </div>
        </Card>
      </TabsContent>

      {budget && budget > 0 && (
        <TabsContent value="budget">
          <Card>
            <div className="p-6">
              <BudgetChart jobId={jobId} budget={budget} />
            </div>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default JobTabs;