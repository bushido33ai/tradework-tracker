
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCalendarJobs = () => {
  return useQuery({
    queryKey: ['calendar-jobs'],
    queryFn: async () => {
      const {
        data: userData
      } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No user found');
      const {
        data,
        error
      } = await supabase.from('jobs').select('*').eq('created_by', userData.user.id).not('start_date', 'is', null);
      if (error) throw error;
      return data;
    }
  });
};
