
import { format, startOfWeek, endOfWeek } from 'date-fns';
import CalendarNavigation from './CalendarNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day' | 'list';
  onMonthChange: (direction: 'previous' | 'next') => void;
}

const CalendarHeader = ({ currentDate, view, onMonthChange }: CalendarHeaderProps) => {
  const isMobile = useIsMobile();

  const getHeaderText = () => {
    if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
        <CalendarNavigation 
          onPreviousMonth={() => onMonthChange('previous')}
          onNextMonth={() => onMonthChange('next')}
        />

        <h2 className="text-lg md:text-2xl font-semibold text-slate-50 md:hidden">
          {getHeaderText()}
        </h2>
      </div>

      <h2 className="hidden md:block text-2xl font-semibold text-slate-50">
        {getHeaderText()}
      </h2>
    </div>
  );
};

export default CalendarHeader;
