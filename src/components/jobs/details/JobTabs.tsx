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
import { DaysWorkedTab } from "./DaysWorkedTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface JobTabsProps {
  jobId: string;
  budget: number | null;
  job_type: string;
}

const JobTabs = ({ jobId, budget, job_type }: JobTabsProps) => {
  const [showMiscCostForm, setShowMiscCostForm] = useState(false);
  const isDayRate = job_type === "Day Rate";

  const { data: totalCosts, isLoading: isLoadingTotals } = useQuery({
    queryKey: ["job-total-costs", jobId],
    queryFn: async () => {
      // Get misc costs
      const { data: miscCosts, error: miscError } = await supabase
        .from("job_misc_costs")
        .select("amount")
        .eq("job_id", jobId);

      if (miscError) throw miscError;

      // Get invoice costs
      const { data: invoices, error: invoiceError } = await supabase
        .from("job_invoices")
        .select("amount")
        .eq("job_id", jobId);

      if (invoiceError) throw invoiceError;

      // Get days worked costs
      const { data: daysWorked, error: daysError } = await supabase
        .from("job_days_worked")
        .select("day_rate")
        .eq("job_id", jobId);

      if (daysError) throw daysError;

      const miscTotal = miscCosts.reduce((sum, cost) => sum + Number(cost.amount), 0);
      const invoiceTotal = invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
      const daysTotal = daysWorked.reduce((sum, day) => sum + Number(day.day_rate || 0), 0);

      return {
        miscTotal,
        invoiceTotal,
        daysTotal,
        grandTotal: miscTotal + invoiceTotal + daysTotal
      };
    }
  });

  return (
    <Tabs defaultValue="designs" className="w-full">
      <TabsList className="w-full flex bg-white/90 backdrop-blur-sm border-b overflow-x-auto scrollbar-none">
        <TabsTrigger 
          value="designs" 
          className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Designs
        </TabsTrigger>
        {isDayRate && (
          <TabsTrigger 
            value="days-worked" 
            className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
          >
            Days
          </TabsTrigger>
        )}
        <TabsTrigger 
          value="invoices" 
          className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Invoices
        </TabsTrigger>
        <TabsTrigger 
          value="notes" 
          className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Notes
        </TabsTrigger>
        <TabsTrigger 
          value="running-total" 
          className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Running Total
        </TabsTrigger>
        {budget && budget > 0 && (
          <TabsTrigger 
            value="budget" 
            className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
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

      {isDayRate && (
        <TabsContent value="days-worked">
          <DaysWorkedTab jobId={jobId} />
        </TabsContent>
      )}

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

      <TabsContent value="running-total">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            {isLoadingTotals ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : totalCosts ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Running Total Breakdown</h3>
                <div className="space-y-2">
                  {isDayRate && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span>Days Worked Total</span>
                      <span className="font-medium">£{totalCosts.daysTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>Miscellaneous Costs</span>
                    <span className="font-medium">£{totalCosts.miscTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>Invoice Costs</span>
                    <span className="font-medium">£{totalCosts.invoiceTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                    <span className="font-medium">Grand Total</span>
                    <span className="font-bold text-lg">£{totalCosts.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Failed to load totals</p>
            )}
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
