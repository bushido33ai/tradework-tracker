import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "@/components/ui/chart";
import { Legend, Tooltip } from "recharts";
import { CustomTooltip } from "./charts/CustomTooltip";
import { BudgetLegend } from "./charts/BudgetLegend";
import { BudgetPieChart } from "./charts/BudgetPieChart";

interface BudgetChartProps {
  jobId: string;
  budget: number;
}

const BudgetChart = ({ jobId, budget }: BudgetChartProps) => {
  const { data: invoices } = useQuery({
    queryKey: ["invoices", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_invoices")
        .select("amount")
        .eq("job_id", jobId);

      if (error) throw error;
      return data;
    },
  });

  const spent = invoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;
  const remaining = Math.max(0, budget - spent);

  const data = [
    { name: "Spent", value: spent },
    { name: "Remaining", value: remaining },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1">Budget Overview</h3>
        <p className="text-sm text-muted-foreground">
          Total Budget: ${budget.toFixed(2)}
        </p>
      </div>
      
      <div className="w-full h-[250px] md:h-[300px] mt-4">
        <ChartContainer
          config={{
            spent: { color: COLORS[0] },
            remaining: { color: COLORS[1] },
          }}
        >
          <>
            <BudgetPieChart data={data} colors={COLORS} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<BudgetLegend data={data} />} />
          </>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BudgetChart;