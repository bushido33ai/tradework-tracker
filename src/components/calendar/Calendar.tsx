
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CalendarEvent from './CalendarEvent';

type CalendarView = 'month' | 'week' | 'day' | 'list';

interface Event {
  id: string;
  title: string;
  date: Date;
  color?: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(2024, 3, 5),
    color: '#10B981'
  },
  {
    id: '2',
    title: 'Project Review',
    date: new Date(2024, 3, 7),
    color: '#10B981'
  },
  {
    id: '3',
    title: 'Presentation APEX5 Hidden Features',
    date: new Date(2024, 3, 22),
    color: '#8B5CF6'
  }
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [events] = useState<Event[]>(mockEvents);

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-slate-50 rounded-lg shadow-lg border border-slate-200 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={today}
            className="hover:bg-gray-100 transition-colors"
          >
            Today
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-slate-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'month' ? 'secondary' : 'ghost'}
            onClick={() => setView('month')}
            className="transition-colors"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'secondary' : 'ghost'}
            onClick={() => setView('week')}
            className="transition-colors"
          >
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'secondary' : 'ghost'}
            onClick={() => setView('day')}
            className="transition-colors"
          >
            Day
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            onClick={() => setView('list')}
            className="transition-colors"
          >
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
                  <CalendarEvent key={event.id} event={event} />
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
