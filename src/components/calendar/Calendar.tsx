import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
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

  const getDaysForView = () => {
    switch (view) {
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case 'month':
      default:
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
    }
  };

  const days = getDaysForView();

  const previousPeriod = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (view === 'week') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const nextPeriod = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (view === 'week') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const today = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setCurrentDate(new Date());
  };

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

  const getHeaderText = () => {
    if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 rounded-lg shadow-lg border border-slate-200 animate-fade-in bg-[#1f1f31]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={previousPeriod} 
              className="hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPeriod} 
              className="hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={today} 
              className="hover:bg-gray-100 transition-colors text-zinc-950"
            >
              Today
            </Button>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-slate-50 md:hidden">
            {getHeaderText()}
          </h2>
        </div>

        <h2 className="hidden md:block text-2xl font-semibold text-slate-50">
          {getHeaderText()}
        </h2>

        <div className="grid grid-cols-2 md:flex items-center gap-2 md:space-x-2">
          <Button 
            variant={view === 'month' ? 'secondary' : 'ghost'} 
            onClick={(e) => {
              e.stopPropagation();
              setView('month');
            }} 
            className="transition-colors w-full md:w-auto"
          >
            Month
          </Button>
          <Button 
            variant={view === 'week' ? 'secondary' : 'ghost'} 
            onClick={(e) => {
              e.stopPropagation();
              setView('week');
            }} 
            className="transition-colors w-full md:w-auto"
          >
            Week
          </Button>
          <Button 
            variant={view === 'day' ? 'secondary' : 'ghost'} 
            onClick={(e) => {
              e.stopPropagation();
              setView('day');
            }} 
            className="transition-colors w-full md:w-auto"
          >
            Day
          </Button>
          <Button 
            variant={view === 'list' ? 'secondary' : 'ghost'} 
            onClick={(e) => {
              e.stopPropagation();
              setView('list');
            }} 
            className="transition-colors w-full md:w-auto"
          >
            List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
          <div key={day} className="bg-slate-50 p-4 text-sm font-medium text-slate-900 text-center border-b border-slate-200">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayEvents = getDayEvents(day);
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] bg-slate-50 p-2 text-sm hover:bg-slate-100 transition-colors",
                !isSameMonth(day, currentDate) && "text-slate-400",
                "border-t border-slate-200",
                view === 'week' && "min-h-[200px]"
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
                {dayEvents.map(event => (
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
