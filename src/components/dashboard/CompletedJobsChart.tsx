
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";

export const CompletedJobsChart = () => {
  const { session } = useSessionContext();
  const { data: isAdmin } = useAdminRole(session?.user?.id);
  const userId = !isAdmin ? session?.user?.id : undefined;

  const { data: completedJobs } = useQuery({
    queryKey: ['completedJobsByMonth', userId],
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

      return jobsByMonth.map((count, index) => ({
        month: format(new Date(2024, index), 'MMM'),
        count,
      }));
    },
  });

  return (
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
  );
};
