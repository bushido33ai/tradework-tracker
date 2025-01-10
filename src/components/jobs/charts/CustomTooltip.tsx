import React from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-lg">£{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};