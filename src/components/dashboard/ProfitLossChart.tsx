
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfYear, getYear } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";

export const ProfitLossChart = () => {
  const { session } = useSessionContext();
  const { data: isAdmin } = useAdminRole(session?.user?.id);
  const userId = !isAdmin ? session?.user?.id : undefined;

  const { data: profitLossData, isLoading } = useQuery({
    queryKey: ['profitLoss', userId],
    queryFn: async () => {
      const startDate = startOfYear(new Date()).toISOString();
      
      let jobsQuery = supabase
        .from('jobs')
        .select('budget, created_at')
        .gte('created_at', startDate);

      let invoicesJoinQuery = supabase
        .from('job_invoices')
        .select('amount, uploaded_at, jobs!inner(created_by)')
        .gte('uploaded_at', startDate);

      if (userId) {
        jobsQuery = jobsQuery.eq('created_by', userId);
        invoicesJoinQuery = invoicesJoinQuery.eq('jobs.created_by', userId);
      }

      const [{ data: jobs }, { data: invoices }] = await Promise.all([
        jobsQuery,
        invoicesJoinQuery
      ]);

      const totalBudget = jobs?.reduce((sum, job) => sum + (Number(job.budget) || 0), 0) || 0;
      const totalInvoiced = invoices?.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0) || 0;
      const totalProfit = totalBudget - totalInvoiced;

      const monthlyData = Array(12).fill(0).map((_, index) => ({
        month: format(new Date(2024, index), 'MMM'),
        budget: 0,
        invoices: 0,
        profit: 0
      }));

      jobs?.forEach(job => {
        const month = new Date(job.created_at).getMonth();
        monthlyData[month].budget += Number(job.budget || 0);
      });

      invoices?.forEach(invoice => {
        const month = new Date(invoice.uploaded_at).getMonth();
        monthlyData[month].invoices += Number(invoice.amount || 0);
      });

      monthlyData.forEach(data => {
        data.profit = data.budget - data.invoices;
      });

      return {
        monthlyData,
        totals: {
          budget: totalBudget,
          invoiced: totalInvoiced,
          profit: totalProfit
        }
      };
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary-600">
        <CardHeader>
          <CardTitle>Profit/Loss Overview {getYear(new Date())}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary-600">
      <CardHeader>
        <CardTitle>Profit/Loss Overview {getYear(new Date())}</CardTitle>
        {profitLossData && (
          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
            <div>
              <span className="text-muted-foreground">Total Budget:</span>
              <p className="text-lg font-bold text-green-600">
                £{profitLossData.totals.budget.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Invoiced:</span>
              <p className="text-lg font-bold text-red-600">
                £{profitLossData.totals.invoiced.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Profit:</span>
              <p className={`text-lg font-bold ${profitLossData.totals.profit >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                £{profitLossData.totals.profit.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitLossData?.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`£${value.toFixed(2)}`, '']}
                labelStyle={{ color: 'black' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#22c55e" 
                name="Budget"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="invoices" 
                stroke="#ef4444" 
                name="Invoices"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#1E40AF" 
                name="Profit/Loss"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
