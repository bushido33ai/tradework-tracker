
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CalendarView = 'month' | 'week' | 'day' | 'list';

interface CalendarViewSelectorProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const CalendarViewSelector = ({ view, onViewChange }: CalendarViewSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:flex items-center gap-2 md:space-x-2">
      <Button 
        variant={view === 'month' ? 'secondary' : 'ghost'} 
        onClick={e => {
          e.stopPropagation();
          onViewChange('month');
        }} 
        className={cn(
          "transition-colors w-full md:w-auto",
          view !== 'month' && "text-slate-50"
        )}
      >
        Month
      </Button>
      <Button 
        variant={view === 'week' ? 'secondary' : 'ghost'} 
        onClick={e => {
          e.stopPropagation();
          onViewChange('week');
        }} 
        className={cn(
          "transition-colors w-full md:w-auto",
          view !== 'week' && "text-slate-50"
        )}
      >
        Week
      </Button>
      <Button 
        variant={view === 'day' ? 'secondary' : 'ghost'} 
        onClick={e => {
          e.stopPropagation();
          onViewChange('day');
        }} 
        className={cn(
          "transition-colors w-full md:w-auto",
          view !== 'day' && "text-slate-50"
        )}
      >
        Day
      </Button>
      <Button 
        variant={view === 'list' ? 'secondary' : 'ghost'} 
        onClick={e => {
          e.stopPropagation();
          onViewChange('list');
        }} 
        className={cn(
          "transition-colors w-full md:w-auto",
          view !== 'list' && "text-slate-50"
        )}
      >
        List
      </Button>
    </div>
  );
};

export default CalendarViewSelector;
