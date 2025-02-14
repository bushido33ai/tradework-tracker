
import { format, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import CalendarEvent from './CalendarEvent';

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  view: 'month' | 'week';
  events: any[];
  onEventClick: (eventId: string) => void;
}

const CalendarGrid = ({ days, currentDate, view, events, onEventClick }: CalendarGridProps) => {
  const isMobile = useIsMobile();

  const getDayEvents = (date: Date) => {
    return events.filter(event => {
      const eventStartDate = event.startDate;
      const eventEndDate = event.endDate || eventStartDate;
      return isSameDay(date, eventStartDate) || isSameDay(date, eventEndDate);
    });
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-slate-200">
      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
        <div key={day} className="bg-slate-50 px-1 md:px-4 py-2 md:py-4 text-xs md:text-sm font-medium text-slate-900 text-center border-b border-slate-200">
          {isMobile ? day.slice(0, 3) : day}
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
                <div key={event.id} onClick={() => onEventClick(event.id)}>
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
  );
};

export default CalendarGrid;
