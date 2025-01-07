import React from "react";

interface BudgetLegendProps {
  payload?: any[];
}

export const BudgetLegend = ({ payload }: BudgetLegendProps) => {
  if (!payload) return null;
  
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};