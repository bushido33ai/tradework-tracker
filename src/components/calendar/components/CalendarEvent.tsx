
import { cn } from '@/lib/utils';

interface CalendarEventProps {
  event: {
    id: string;
    title: string;
    color?: string;
  };
  isStart?: boolean;
  isEnd?: boolean;
  isMiddle?: boolean;
}

const CalendarEvent = ({ event, isStart = true, isEnd = true, isMiddle = false }: CalendarEventProps) => {
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs mb-1 text-white",
        "transition-all duration-200 hover:opacity-90 cursor-pointer",
        "select-none",
        // Round left edge only on start
        isStart && "rounded-l-md",
        // Round right edge only on end
        isEnd && "rounded-r-md",
        // Middle segments have no rounding
        isMiddle && "rounded-none"
      )}
      style={{
        backgroundColor: event.color || '#10B981',
      }}
    >
      <span className="truncate block">{event.title}</span>
    </div>
  );
};

export default CalendarEvent;
