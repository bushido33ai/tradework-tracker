
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface RunningTotalTabProps {
  jobId: string;
  isDayRate: boolean;
}

export const RunningTotalTab = ({ jobId, isDayRate }: RunningTotalTabProps) => {
  const { data: totalCosts, isLoading: isLoadingTotals } = useQuery({
    queryKey: ["job-total-costs", jobId],
    queryFn: async () => {
      // Get misc costs
      const { data: miscCosts, error: miscError } = await supabase
        .from("job_misc_costs")
        .select("amount")
        .eq("job_id", jobId);

      if (miscError) throw miscError;

      // Get invoice costs
      const { data: invoices, error: invoiceError } = await supabase
        .from("job_invoices")
        .select("amount")
        .eq("job_id", jobId);

      if (invoiceError) throw invoiceError;

      // Get days worked costs
      const { data: daysWorked, error: daysError } = await supabase
        .from("job_days_worked")
        .select("day_rate")
        .eq("job_id", jobId);

      if (daysError) throw daysError;

      const miscTotal = miscCosts?.reduce((sum, cost) => sum + Number(cost.amount), 0) ?? 0;
      const invoiceTotal = invoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) ?? 0;
      const daysTotal = daysWorked?.reduce((sum, day) => sum + Number(day.day_rate || 0), 0) ?? 0;

      return {
        miscTotal,
        invoiceTotal,
        daysTotal,
        grandTotal: miscTotal + invoiceTotal + daysTotal
      };
    }
  });

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {isLoadingTotals ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : totalCosts ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Running Total Breakdown</h3>
            <div className="space-y-2">
              {isDayRate && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Days Worked Total</span>
                  <span className="font-medium">£{totalCosts.daysTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Miscellaneous Costs</span>
                <span className="font-medium">£{totalCosts.miscTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Invoice Costs</span>
                <span className="font-medium">£{totalCosts.invoiceTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                <span className="font-medium">Grand Total</span>
                <span className="font-bold text-lg">£{totalCosts.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Failed to load totals</p>
        )}
      </div>
    </Card>
  );
};
