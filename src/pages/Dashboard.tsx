import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  // Query for completed jobs by month/year
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

  // Query for total job spend this year
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

  // Query for total invoices this year
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
    </div>
  );
};

export default Dashboard;