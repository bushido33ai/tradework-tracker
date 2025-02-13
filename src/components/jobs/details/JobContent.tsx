
import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface JobContentProps {
  description: string;
  location: string;
  budget?: number | null;
  start_date: string;
  end_date?: string;
  job_type: string;
}

const JobContent = ({ description, location, budget, start_date, end_date, job_type }: JobContentProps) => {
  return (
    <CardContent>
      <div className="grid gap-4">
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📍 {location}</span>
          {budget && <span>💰 £{budget.toFixed(2)}</span>}
          <span>📅 Start Date: {format(new Date(start_date), "PPP")}</span>
          {end_date && <span>🏁 End Date: {format(new Date(end_date), "PPP")}</span>}
          <span>📋 Type: {job_type}</span>
        </div>
      </div>
    </CardContent>
  );
};

export default JobContent;
