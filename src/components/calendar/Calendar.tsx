
import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useCalendarJobs } from './hooks/useCalendarJobs';
import CalendarHeader from './components/CalendarHeader';
import CalendarViewSelector from './components/CalendarViewSelector';
import CalendarGrid from './components/CalendarGrid';
import CalendarListView from './components/CalendarListView';

type CalendarView = 'month' | 'week' | 'day' | 'list';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const navigate = useNavigate();
  
  const { data: jobs = [] } = useCalendarJobs();

  const getDaysForView = () => {
    switch (view) {
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case 'month':
      default:
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
    }
  };

  const handleMonthChange = (direction: 'previous' | 'next') => {
    setCurrentDate(prev => direction === 'previous' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/jobs/${eventId}`);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return '#F97316'; // Orange
      case 'in_progress':
        return '#3B82F6'; // Blue
      case 'completed':
        return '#10B981'; // Green
      case 'cancelled':
        return '#6B7280'; // Grey
      default:
        return '#3B82F6'; // Default to blue
    }
  };

  const formattedEvents = jobs.map(job => ({
    id: job.id,
    title: job.title,
    startDate: parseISO(job.start_date),
    endDate: job.end_date ? parseISO(job.end_date) : parseISO(job.start_date),
    color: getStatusColor(job.status)
  }));

  // Only render grid for month and week views
  const shouldRenderGrid = view === 'month' || view === 'week';

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 rounded-lg shadow-lg border border-slate-200 animate-fade-in bg-[#1f1f31]"
         onClick={e => e.stopPropagation()}>
      <CalendarHeader 
        currentDate={currentDate}
        view={view}
        onMonthChange={handleMonthChange}
      />

      <CalendarViewSelector 
        view={view}
        onViewChange={setView}
      />

      {view === 'list' ? (
        <CalendarListView 
          events={formattedEvents}
          onEventClick={handleEventClick}
        />
      ) : shouldRenderGrid ? (
        <CalendarGrid 
          days={getDaysForView()}
          currentDate={currentDate}
          view={view === 'month' ? 'month' : 'week'}
          events={formattedEvents}
          onEventClick={handleEventClick}
        />
      ) : null}
    </div>
  );
};

export default Calendar;
