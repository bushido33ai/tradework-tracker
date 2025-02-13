
interface Event {
  id: string;
  title: string;
  date: Date;
  color?: string;
}

interface CalendarEventProps {
  event: Event;
}

const CalendarEvent = ({ event }: CalendarEventProps) => {
  return (
    <div
      className="mb-1 truncate rounded px-2 py-1 text-sm font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
      style={{ backgroundColor: event.color || '#3B82F6' }}
      title={event.title}
    >
      {event.title}
    </div>
  );
};

export default CalendarEvent;
