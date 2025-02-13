
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Job {
  id: string;
  title: string;
  start_date: string;
  job_number: string;
  status: string;
}

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const WorkCalendar = () => {
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

  const events = jobs?.map(job => ({
    id: job.id,
    title: job.title,
    start: new Date(job.start_date),
    end: new Date(job.start_date),
    allDay: true,
    resource: job
  })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen pt-16 md:pt-4 md:pl-64">
      <div className="flex-1 p-2 md:p-4 flex flex-col min-h-0">
        <h1 className="text-2xl font-bold mb-2 md:mb-4">Work Calendar</h1>
        <Card className="flex-1 p-2 md:p-4">
          <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-140px)]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              defaultView="month"
              onSelectEvent={(event) => {
                navigate(`/jobs/${event.id}`);
              }}
              eventPropGetter={(event) => ({
                className: 'bg-primary hover:bg-primary/90 rounded-md border-none',
              })}
            />
          </div>
        </Card>
      </div>
    </main>
  );
};

export default WorkCalendar;
