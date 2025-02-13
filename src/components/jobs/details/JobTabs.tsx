
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";
import BudgetChart from "@/components/jobs/BudgetChart";
import JobNotes from "./JobNotes";
import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { MiscCostForm } from "./MiscCostForm";
import { MiscCostsList } from "./MiscCostsList";

interface JobTabsProps {
  jobId: string;
  budget: number | null;
}

const JobTabs = ({ jobId, budget }: JobTabsProps) => {
  const [showMiscCostForm, setShowMiscCostForm] = useState(false);

  return (
    <Tabs defaultValue="designs" className="w-full">
      <TabsList className="w-full flex bg-white/90 backdrop-blur-sm border-b">
        <TabsTrigger 
          value="designs" 
          className="flex-1 font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Designs
        </TabsTrigger>
        <TabsTrigger 
          value="invoices" 
          className="flex-1 font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Invoices
        </TabsTrigger>
        <TabsTrigger 
          value="notes" 
          className="flex-1 font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Notes
        </TabsTrigger>
        {budget && budget > 0 && (
          <TabsTrigger 
            value="budget" 
            className="flex-1 font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
          >
            Budget
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="designs">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <FileUpload jobId={jobId} type="design" />
            </div>
            <FileList jobId={jobId} type="design" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="invoices">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <div className="flex justify-between items-end mb-4">
              <div className="space-y-2">
                <h4 className="font-medium">Miscellaneous Costs</h4>
                <RainbowButton
                  onClick={() => setShowMiscCostForm(!showMiscCostForm)}
                >
                  {showMiscCostForm ? "Cancel" : "Add Cost"}
                </RainbowButton>
              </div>
              <div className="flex items-end">
                <FileUpload jobId={jobId} type="invoice" />
              </div>
            </div>

            {showMiscCostForm && (
              <div className="mb-4">
                <MiscCostForm 
                  jobId={jobId} 
                  onSuccess={() => setShowMiscCostForm(false)} 
                />
              </div>
            )}

            <div className="mb-4">
              <MiscCostsList jobId={jobId} />
            </div>

            <FileList jobId={jobId} type="invoice" />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <JobNotes jobId={jobId} />
          </div>
        </Card>
      </TabsContent>

      {budget && budget > 0 && (
        <TabsContent value="budget">
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
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
