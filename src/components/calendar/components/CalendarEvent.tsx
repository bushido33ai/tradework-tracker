
import { cn } from '@/lib/utils';

interface CalendarEventProps {
  event: {
    id: string;
    title: string;
    color?: string;
  };
  isStart?: boolean;
  isEnd?: boolean;
}

const CalendarEvent = ({ event, isStart = true, isEnd = true }: CalendarEventProps) => {
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs mb-1 truncate text-white",
        "transition-all duration-200 hover:scale-[1.02] cursor-pointer",
        "animate-scale-in select-none",
        isStart ? "rounded-l-md" : "",
        isEnd ? "rounded-r-md" : "",
        !isStart && !isEnd && "border-l-0 border-r-0"
      )}
      style={{
        backgroundColor: event.color || '#10B981',
      }}
    >
      {event.title}
    </div>
  );
};

export default CalendarEvent;
