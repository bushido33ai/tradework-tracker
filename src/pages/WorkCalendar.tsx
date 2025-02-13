
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
    if (dayJobs.length >= 1) {
      navigate(`/jobs/${dayJobs[0].id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderDayContents = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayJobs = jobsByDate?.[dateStr] || [];
    
    if (dayJobs.length === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 p-1 text-xs bg-primary/10">
        {dayJobs.map((job, index) => (
          <div key={job.id} className={`truncate ${index > 0 ? 'hidden sm:block' : ''}`}>
            {job.title}
          </div>
        ))}
        {dayJobs.length > 1 && (
          <div className="text-primary text-[10px]">
            +{dayJobs.length - 1} more
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="flex flex-col h-screen pt-16 md:pt-4 md:pl-64">
      <div className="flex-1 p-4 flex flex-col min-h-0">
        <h1 className="text-2xl font-bold mb-4">Work Calendar</h1>
        <Card className="flex-1 p-4 overflow-auto">
          <div className="grid h-full">
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
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  fontWeight: 'bold',
                  position: 'relative',
                  minHeight: '100px'
                }
              }}
              components={{
                Day: ({ date, ...props }) => (
                  <div className="relative h-full min-h-[100px] p-1" {...props}>
                    <div className="absolute top-1 left-2">
                      {date.getDate()}
                    </div>
                    {renderDayContents(date)}
                  </div>
                )
              }}
              className="h-full w-full [&_.rdp-months]:h-full [&_.rdp-month]:h-full [&_.rdp-table]:h-full [&_.rdp]:grid [&_.rdp-cell]:h-[100px] [&_.rdp]:p-0"
            />
          </div>
        </Card>
      </div>
    </main>
  );
};

export default WorkCalendar;
