
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle, PoundSterling, Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";

export const DashboardStats = () => {
  const { session } = useSessionContext();
  const { data: isAdmin } = useAdminRole(session?.user?.id);
  const userId = !isAdmin ? session?.user?.id : undefined;

  const { data: currentJobs } = useQuery({
    queryKey: ['currentJobs', userId],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_progress']);

      if (userId) {
        query = query.eq('created_by', userId);
      }

      const { count } = await query;
      return count || 0;
    },
  });

  const { data: completedJobs } = useQuery({
    queryKey: ['completedJobs', userId],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      let query = supabase
        .from('jobs')
        .select('created_at')
        .eq('status', 'completed')
        .gte('created_at', startOfYear);

      if (userId) {
        query = query.eq('created_by', userId);
      }

      const { data } = await query;

      const jobsByMonth = Array(12).fill(0);
      data?.forEach(job => {
        const month = new Date(job.created_at).getMonth();
        jobsByMonth[month]++;
      });

      return jobsByMonth.reduce((sum, count) => sum + count, 0) || 0;
    },
  });

  const { data: totalSpend } = useQuery({
    queryKey: ['totalSpend', userId],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      let query = supabase
        .from('jobs')
        .select('budget')
        .gte('created_at', startOfYear);

      if (userId) {
        query = query.eq('created_by', userId);
      }

      const { data } = await query;
      return data?.reduce((sum, job) => sum + (job.budget || 0), 0) || 0;
    },
  });

  const { data: totalInvoices } = useQuery({
    queryKey: ['totalInvoices', userId],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      let query = supabase
        .from('job_invoices')
        .select('amount, jobs!inner(created_by)')
        .gte('uploaded_at', startOfYear);

      if (userId) {
        query = query.eq('jobs.created_by', userId);
      }

      const { data } = await query;
      return data?.reduce((sum, row) => sum + (row.amount || 0), 0) || 0;
    },
  });

  return (
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
            {completedJobs || 0}
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
  );
};
