import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentJobs = (userId: string | undefined) => {
  return useQuery({
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
};

export const useCompletedJobs = (userId: string | undefined) => {
  return useQuery({
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
};

export const useTotalSpend = (userId: string | undefined) => {
  return useQuery({
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
};

export const useTotalCosts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['totalInvoices', userId],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      
      let invoicesQuery = supabase
        .from('job_invoices')
        .select('amount, jobs!inner(created_by)')
        .gte('uploaded_at', startOfYear);

      let miscCostsQuery = supabase
        .from('job_misc_costs')
        .select('amount, jobs!inner(created_by)')
        .gte('created_at', startOfYear);

      let daysWorkedQuery = supabase
        .from('job_days_worked')
        .select('day_rate, jobs!inner(created_by)')
        .gte('date_worked', startOfYear);

      if (userId) {
        invoicesQuery = invoicesQuery.eq('jobs.created_by', userId);
        miscCostsQuery = miscCostsQuery.eq('jobs.created_by', userId);
        daysWorkedQuery = daysWorkedQuery.eq('jobs.created_by', userId);
      }

      const [
        { data: invoices },
        { data: miscCosts },
        { data: daysWorked }
      ] = await Promise.all([
        invoicesQuery,
        miscCostsQuery,
        daysWorkedQuery
      ]);

      const totalInvoiced = invoices?.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0) || 0;
      const totalMiscCosts = miscCosts?.reduce((sum, cost) => sum + (Number(cost.amount) || 0), 0) || 0;
      const totalDaysWorkedCost = daysWorked?.reduce((sum, day) => sum + (Number(day.day_rate) || 0), 0) || 0;

      return totalInvoiced + totalMiscCosts + totalDaysWorkedCost;
    },
  });
};

export const useTotalReceived = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['totalReceived', userId],
    queryFn: async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      
      let paymentsQuery = supabase
        .from('job_payments')
        .select('amount, jobs!inner(created_by)')
        .gte('payment_date', startOfYear);

      if (userId) {
        paymentsQuery = paymentsQuery.eq('jobs.created_by', userId);
      }

      const { data: payments } = await paymentsQuery;
      return payments?.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;
    },
  });
};