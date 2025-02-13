
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Job {
  id: string;
  title: string;
  start_date: string;
  job_number: string;
  status: string;
}

const WorkCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["calendar-jobs", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, start_date, job_number, status")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Job[];
    },
  });

  // Create a map of dates to jobs for easier lookup
  const jobsByDate = jobs?.reduce((acc, job) => {
    if (job.start_date) {
      const dateKey = job.start_date.split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(job);
    }
    return acc;
  }, {} as Record<string, Job[]>);

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayJobs = jobsByDate?.[dateStr] || [];
    if (dayJobs.length === 1) {
      // If there's only one job, navigate directly to it
      navigate(`/jobs/${dayJobs[0].id}`);
    } else if (dayJobs.length > 1) {
      // If there are multiple jobs, you might want to show them in a list
      // For now, we'll navigate to the first one
      navigate(`/jobs/${dayJobs[0].id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Work Calendar</h1>
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate);
              handleDayClick(newDate);
            }
          }}
          modifiers={{
            booked: (date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              return Boolean(jobsByDate?.[dateStr]?.length);
            }
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: '#cbd5e1',
              color: '#1e293b',
              fontWeight: 'bold'
            }
          }}
          className="rounded-md border"
        />
      </Card>
    </div>
  );
};

export default WorkCalendar;
