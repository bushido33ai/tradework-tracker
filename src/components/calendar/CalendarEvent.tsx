
import { cn } from '@/lib/utils';

interface CalendarEventProps {
  event: {
    id: string;
    title: string;
    color?: string;
  };
}

const CalendarEvent = ({ event }: CalendarEventProps) => {
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs rounded-md mb-1 truncate",
        "transition-all duration-200 hover:scale-[1.02] cursor-pointer",
        "animate-scale-in select-none"
      )}
      style={{
        backgroundColor: event.color || '#10B981',
        color: 'white'
      }}
    >
      {event.title}
    </div>
  );
};

export default CalendarEvent;
