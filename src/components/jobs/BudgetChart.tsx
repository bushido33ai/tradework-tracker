import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-lg">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-8 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">
              {entry.value}: ${data[index].value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1">Budget Overview</h3>
        <p className="text-sm text-muted-foreground">
          Total Budget: ${budget.toFixed(2)}
        </p>
      </div>
      
      <div className="h-[300px] w-full">
        <ChartContainer
          config={{
            spent: { color: COLORS[0] },
            remaining: { color: COLORS[1] },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                labelLine={true}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index]}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BudgetChart;