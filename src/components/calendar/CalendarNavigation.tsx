
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  onPreviousMonth: (e: React.MouseEvent | React.TouchEvent) => void;
  onNextMonth: (e: React.MouseEvent | React.TouchEvent) => void;
}

const CalendarNavigation = ({ onPreviousMonth, onNextMonth }: CalendarNavigationProps) => {
  return (
    <div 
      className="flex items-center space-x-2" 
      onClick={e => e.stopPropagation()}
    >
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onClick={onPreviousMonth}
        onTouchStart={onPreviousMonth}
        className="hover:bg-gray-100 transition-colors touch-none select-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onClick={onNextMonth}
        onTouchStart={onNextMonth}
        className="hover:bg-gray-100 transition-colors touch-none select-none"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarNavigation;
