
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DaysWorkedTab } from "./DaysWorkedTab";
import { JobTabList } from "./tabs/JobTabList";
import { DesignsTab } from "./tabs/DesignsTab";
import { InvoicesTab } from "./tabs/InvoicesTab";
import { NotesTab } from "./tabs/NotesTab";
import { RunningTotalTab } from "./tabs/RunningTotalTab";
import { BudgetTab } from "./tabs/BudgetTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { ExtrasTab } from "./tabs/ExtrasTab";

interface JobTabsProps {
  jobId: string;
  budget: number | null;
  job_type: string;
}

const JobTabs = ({ jobId, budget, job_type }: JobTabsProps) => {
  const isDayRate = job_type === "Day Rate";
  const showBudget = Boolean(budget && budget > 0);

  return (
    <div className="w-full">
      <Tabs defaultValue="designs" className="w-full">
        <JobTabList isDayRate={isDayRate} showBudget={showBudget} />
        
        <TabsContent value="designs">
          <DesignsTab jobId={jobId} />
        </TabsContent>

        {isDayRate && (
          <TabsContent value="days-worked">
            <DaysWorkedTab jobId={jobId} />
          </TabsContent>
        )}

        <TabsContent value="invoices">
          <InvoicesTab jobId={jobId} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab jobId={jobId} />
        </TabsContent>

        <TabsContent value="extras">
          <ExtrasTab jobId={jobId} />
        </TabsContent>

        <TabsContent value="notes">
          <NotesTab jobId={jobId} />
        </TabsContent>

        <TabsContent value="running-total">
          <RunningTotalTab jobId={jobId} isDayRate={isDayRate} />
        </TabsContent>

        {showBudget && (
          <TabsContent value="budget">
            <BudgetTab jobId={jobId} budget={budget!} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default JobTabs;
