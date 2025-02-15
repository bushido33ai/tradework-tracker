
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DaysWorkedStatsProps {
  totalHours: number;
  totalCost: number;
  showForm: boolean;
  onToggleForm: () => void;
}

export const DaysWorkedStats = ({
  totalHours,
  totalCost,
  showForm,
  onToggleForm,
}: DaysWorkedStatsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Days Worked</h3>
        <p className="text-sm text-muted-foreground">
          Total Hours: {totalHours}
        </p>
        <p className="text-sm text-muted-foreground">
          Total Cost: £{totalCost.toFixed(2)}
        </p>
      </div>
      <Button onClick={onToggleForm}>
        {showForm ? "Cancel" : "Add Days"}
      </Button>
    </div>
  );
};
