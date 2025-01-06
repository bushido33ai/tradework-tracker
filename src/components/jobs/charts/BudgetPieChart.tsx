import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface BudgetPieChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

export const BudgetPieChart = ({ data, colors }: BudgetPieChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={isMobile ? 40 : 60}
          outerRadius={isMobile ? 60 : 80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index]}
              className="transition-all duration-200 hover:opacity-80"
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};