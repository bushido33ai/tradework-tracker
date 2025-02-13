import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CalendarEvent from './CalendarEvent';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type CalendarView = 'month' | 'week' | 'day' | 'list';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const navigate = useNavigate();

  const { data: jobs = [] } = useQuery({
    queryKey: ['calendar-jobs'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', userData.user.id)
        .not('start_date', 'is', null);

      if (error) throw error;
      return data;
    },
  });

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const getDayEvents = (date: Date) => {
    return jobs
      .filter(job => {
        const jobStartDate = parseISO(job.start_date);
        const jobEndDate = job.end_date ? parseISO(job.end_date) : jobStartDate;
        
        return isWithinInterval(date, {
          start: jobStartDate,
          end: jobEndDate
        });
      })
      .map(job => ({
        id: job.id,
        title: job.title,
        startDate: parseISO(job.start_date),
        endDate: job.end_date ? parseISO(job.end_date) : parseISO(job.start_date),
        color: job.status === 'completed' ? '#10B981' : '#3B82F6'
      }));
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/jobs/${eventId}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 rounded-lg shadow-lg border border-slate-200 animate-fade-in bg-slate-500 hover:bg-slate-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={previousMonth} className="hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={today} className="hover:bg-gray-100 transition-colors">
            Today
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-slate-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center space-x-2">
          <Button variant={view === 'month' ? 'secondary' : 'ghost'} onClick={() => setView('month')} className="transition-colors">
            Month
          </Button>
          <Button variant={view === 'week' ? 'secondary' : 'ghost'} onClick={() => setView('week')} className="transition-colors">
            Week
          </Button>
          <Button variant={view === 'day' ? 'secondary' : 'ghost'} onClick={() => setView('day')} className="transition-colors">
            Day
          </Button>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')} className="transition-colors">
            List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <div
            key={day}
            className="bg-slate-50 p-4 text-sm font-medium text-slate-900 text-center border-b border-slate-200"
          >
            {day}
          </div>
        ))}
        
        {days.map((day) => {
          const dayEvents = getDayEvents(day);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] bg-slate-50 p-2 text-sm hover:bg-slate-100 transition-colors",
                !isSameMonth(day, currentDate) && "text-slate-400",
                "border-t border-slate-200"
              )}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  isSameDay(day, new Date()) && "bg-blue-600 text-white"
                )}
              >
                {format(day, 'd')}
              </time>
              <div className="mt-2">
                {dayEvents.map((event) => (
                  <div key={event.id} onClick={() => handleEventClick(event.id)}>
                    <CalendarEvent 
                      event={event}
                      isStart={isSameDay(day, event.startDate)}
                      isEnd={isSameDay(day, event.endDate)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
