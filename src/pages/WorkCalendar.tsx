
import Calendar from "@/components/calendar/Calendar";

const WorkCalendar = () => {
  return (
    <div 
      className="h-full w-full" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Calendar />
    </div>
  );
};

export default WorkCalendar;
