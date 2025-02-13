
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [date, setDate] = useState(new Date());

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

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(date);
    if (action === 'PREV') {
      newDate.setMonth(date.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(date.getMonth() + 1);
    } else {
      newDate.setTime(new Date().getTime());
    }
    setDate(newDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen md:pl-64">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-2 md:p-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleNavigate('PREV')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleNavigate('NEXT')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleNavigate('TODAY')}
            >
              Today
            </Button>
            <h2 className="text-xl font-semibold ml-4">
              {format(date, 'MMMM yyyy')}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Month</Button>
            <Button variant="outline" size="sm">Week</Button>
            <Button variant="outline" size="sm">Day</Button>
            <Button variant="outline" size="sm">List</Button>
          </div>
        </div>
        <Card className="flex-1 shadow-sm rounded-none border-0">
          <div className="h-[calc(100vh-80px)]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              date={date}
              onNavigate={(newDate) => setDate(newDate)}
              onSelectEvent={(event) => {
                navigate(`/jobs/${event.id}`);
              }}
              eventPropGetter={(event) => ({
                className: 'bg-primary hover:bg-primary/90 rounded-md border-none',
              })}
              components={{
                toolbar: () => null,
              }}
            />
          </div>
        </Card>
      </div>
    </main>
  );
};

export default WorkCalendar;
