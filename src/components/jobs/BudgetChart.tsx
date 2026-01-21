import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface BudgetChartProps {
  jobId: string;
  budget: number;
}

const BudgetChart = ({ jobId, budget }: BudgetChartProps) => {
  const isMobile = useIsMobile();
  
  const { data: invoicesData } = useQuery({
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

  const { data: miscCostsData } = useQuery({
    queryKey: ["miscCosts", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_misc_costs")
        .select("amount")
        .eq("job_id", jobId);

      if (error) throw error;
      return data;
    },
  });

  const invoicesTotal = invoicesData?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;
  const miscCostsTotal = miscCostsData?.reduce((sum, cost) => sum + Number(cost.amount), 0) || 0;
  const totalSpent = invoicesTotal + miscCostsTotal;
  const remaining = Math.max(0, budget - totalSpent);
  const spentPercentage = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  const data = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: remaining },
  ];

  const COLORS = {
    spent: "hsl(0, 84%, 60%)",
    remaining: "hsl(142, 71%, 45%)"
  };

  const GRADIENT_COLORS = [
    { start: "hsl(0, 84%, 65%)", end: "hsl(0, 84%, 55%)" },
    { start: "hsl(142, 71%, 50%)", end: "hsl(142, 71%, 40%)" }
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Chart */}
      <div className="relative w-full" style={{ height: isMobile ? 220 : 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={GRADIENT_COLORS[0].start} />
                <stop offset="100%" stopColor={GRADIENT_COLORS[0].end} />
              </linearGradient>
              <linearGradient id="remainingGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={GRADIENT_COLORS[1].start} />
                <stop offset="100%" stopColor={GRADIENT_COLORS[1].end} />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 55 : 75}
              outerRadius={isMobile ? 85 : 110}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              style={{ filter: "url(#shadow)" }}
            >
              <Cell fill="url(#spentGradient)" />
              <Cell fill="url(#remainingGradient)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl md:text-4xl font-bold text-foreground">
            {spentPercentage}%
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">spent</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">Spent</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
            £{totalSpent.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Remaining</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
            £{remaining.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Budget breakdown */}
      <div className="w-full max-w-sm space-y-2 pt-2 border-t border-border/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Budget</span>
          <span className="font-semibold">£{budget.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Invoices</span>
          <span className="text-red-600 dark:text-red-400">£{invoicesTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Misc Costs</span>
          <span className="text-red-600 dark:text-red-400">£{miscCostsTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
