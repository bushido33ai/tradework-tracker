import React from "react";

interface BudgetLegendProps {
  payload?: any[];
  data: Array<{ name: string; value: number }>;
}

export const BudgetLegend = ({ payload, data }: BudgetLegendProps) => {
  if (!payload) return null;
  
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
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