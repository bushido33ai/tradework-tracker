
import { Card } from "@/components/ui/card";
import BudgetChart from "@/components/jobs/BudgetChart";

interface BudgetTabProps {
  jobId: string;
  budget: number;
}

export const BudgetTab = ({ jobId, budget }: BudgetTabProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <BudgetChart jobId={jobId} budget={budget} />
      </div>
    </Card>
  );
};
