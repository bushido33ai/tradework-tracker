import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfYear, getYear } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Briefcase, CheckCircle, PoundSterling, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: currentJobs } = useQuery({
    queryKey: ['currentJobs'],
    queryFn: async () => {
      const { count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_progress']);
      return count || 0;
    },
  });

  const { data: completedJobs } = useQuery({
    queryKey: ['completedJobs'],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const { data } = await supabase
        .from('jobs')
        .select('created_at')
        .eq('status', 'completed')
        .gte('created_at', startOfYear);

      const jobsByMonth = Array(12).fill(0);
      data?.forEach(job => {
        const month = new Date(job.created_at).getMonth();
        jobsByMonth[month]++;
      });

      return jobsByMonth.map((count, index) => ({
        month: format(new Date(2024, index), 'MMM'),
        count,
      }));
    },
  });

  const { data: totalSpend } = useQuery({
    queryKey: ['totalSpend'],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const { data } = await supabase
        .from('jobs')
        .select('budget')
        .gte('created_at', startOfYear);

      return data?.reduce((sum, job) => sum + (job.budget || 0), 0) || 0;
    },
  });

  const { data: totalInvoices } = useQuery({
    queryKey: ['totalInvoices'],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const { data } = await supabase
        .from('job_invoices')
        .select('amount')
        .gte('uploaded_at', startOfYear);

      return data?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
    },
  });

  // New query for profit/loss data
  const { data: profitLossData } = useQuery({
    queryKey: ['profitLoss'],
    queryFn: async () => {
      const startDate = startOfYear(new Date()).toISOString();
      
      // Fetch all jobs created this year
      const { data: jobs } = await supabase
        .from('jobs')
        .select('budget, created_at')
        .gte('created_at', startDate);

      // Fetch all invoices created this year
      const { data: invoices } = await supabase
        .from('job_invoices')
        .select('amount, uploaded_at')
        .gte('uploaded_at', startDate);

      // Calculate totals
      const totalBudget = jobs?.reduce((sum, job) => sum + (Number(job.budget) || 0), 0) || 0;
      const totalInvoiced = invoices?.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0) || 0;
      const totalProfit = totalBudget - totalInvoiced;

      // Initialize monthly data
      const monthlyData = Array(12).fill(0).map((_, index) => ({
        month: format(new Date(2024, index), 'MMM'),
        budget: 0,
        invoices: 0,
        profit: 0
      }));

      // Aggregate job budgets by month
      jobs?.forEach(job => {
        const month = new Date(job.created_at).getMonth();
        monthlyData[month].budget += Number(job.budget || 0);
      });

      // Aggregate invoices by month
      invoices?.forEach(invoice => {
        const month = new Date(invoice.uploaded_at).getMonth();
        monthlyData[month].invoices += Number(invoice.amount || 0);
      });

      // Calculate profit/loss for each month
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link 
                to="/jobs" 
                className="text-2xl font-bold hover:text-primary transition-colors"
              >
                {currentJobs || 0}
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completed Jobs (YTD)</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link 
                to="/jobs?status=completed" 
                className="text-2xl font-bold hover:text-primary transition-colors"
              >
                {completedJobs?.reduce((sum, month) => sum + month.count, 0) || 0}
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Spend (YTD)</CardTitle>
              <PoundSterling className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{totalSpend?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Invoiced (YTD)</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{totalInvoices?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary-600">
          <CardHeader>
            <CardTitle>Completed Jobs by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completedJobs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} jobs`, 'Completed']}
                    labelStyle={{ color: 'black' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#1E40AF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary-600">
          <CardHeader>
            <CardTitle>Profit/Loss Overview {getYear(new Date())}</CardTitle>
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Total Budget:</span>
                <p className="text-lg font-bold text-green-600">
                  £{profitLossData?.totals.budget.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Invoiced:</span>
                <p className="text-lg font-bold text-red-600">
                  £{profitLossData?.totals.invoiced.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Profit:</span>
                <p className={`text-lg font-bold ${profitLossData?.totals.profit >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                  £{profitLossData?.totals.profit.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default Dashboard;