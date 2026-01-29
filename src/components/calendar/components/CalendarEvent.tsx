
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
        "animate-scale-in select-none",
        // Round left edge only on start
        isStart && "rounded-l-md ml-0",
        // Round right edge only on end
        isEnd && "rounded-r-md mr-0",
        // Middle segments extend to edges
        isMiddle && "rounded-none -mx-2 px-3",
        // Start segments extend right
        isStart && !isEnd && "rounded-r-none -mr-2 pr-3",
        // End segments extend left  
        isEnd && !isStart && "rounded-l-none -ml-2 pl-3"
      )}
      style={{
        backgroundColor: event.color || '#10B981',
      }}
    >
      {/* Only show title on start day or if it's a single day event */}
      {(isStart || (isStart && isEnd)) ? (
        <span className="truncate block">{event.title}</span>
      ) : (
        <span className="opacity-0">&nbsp;</span>
      )}
    </div>
  );
};

export default CalendarEvent;
