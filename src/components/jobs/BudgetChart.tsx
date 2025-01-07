import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "@/components/ui/chart";
import { Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CustomTooltip } from "./charts/CustomTooltip";
import { BudgetLegend } from "./charts/BudgetLegend";

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
    { name: "Budget Overview", spent, remaining },
  ];

  const COLORS = {
    spent: "#ef4444",
    remaining: "#22c55e"
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1">Budget Overview</h3>
        <p className="text-sm text-muted-foreground">
          Total Budget: ${budget.toFixed(2)}
        </p>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ChartContainer
          config={{
            spent: { color: COLORS.spent },
            remaining: { color: COLORS.remaining },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `$${value}`}
                domain={[0, budget]}
              />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="spent" 
                stackId="a" 
                fill={COLORS.spent} 
                name="Spent"
                radius={[4, 0, 0, 4]}
              />
              <Bar 
                dataKey="remaining" 
                stackId="a" 
                fill={COLORS.remaining} 
                name="Remaining"
                radius={[0, 4, 4, 0]}
              />
              <Legend content={<BudgetLegend />} verticalAlign="bottom" height={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BudgetChart;