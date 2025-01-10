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
      <TabsList className="w-full flex bg-white/50 backdrop-blur-sm">
        <TabsTrigger value="designs" className="flex-1">Designs</TabsTrigger>
        <TabsTrigger value="invoices" className="flex-1">Invoices</TabsTrigger>
        <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
        {budget && budget > 0 && (
          <TabsTrigger value="budget" className="flex-1">Budget</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="designs">
        <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200">
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <FileUpload jobId={jobId} type="design" />
            </div>
            <FileList jobId={jobId} type="design" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="invoices">
        <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200">
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <FileUpload jobId={jobId} type="invoice" />
            </div>
            <FileList jobId={jobId} type="invoice" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200">
          <div className="p-6">
            <JobNotes jobId={jobId} />
          </div>
        </Card>
      </TabsContent>

      {budget && budget > 0 && (
        <TabsContent value="budget">
          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200">
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