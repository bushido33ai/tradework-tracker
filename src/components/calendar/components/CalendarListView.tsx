
import { format, isSameDay } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarListViewProps {
  events: any[];
  onEventClick: (eventId: string) => void;
}

const CalendarListView = ({ events, onEventClick }: CalendarListViewProps) => {
  const isMobile = useIsMobile();
  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      {sortedEvents.length > 0 ? (
        <div className="space-y-4">
          {sortedEvents.map(event => (
            <div 
              key={event.id}
              onClick={() => onEventClick(event.id)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-slate-500">
                  {format(event.startDate, 'MMM d, yyyy')}
                  {!isSameDay(event.startDate, event.endDate) && 
                    ` - ${format(event.endDate, 'MMM d, yyyy')}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">No events scheduled</p>
      )}
    </div>
  );
};

export default CalendarListView;
