
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarNavigation = ({ onPreviousMonth, onNextMonth }: CalendarNavigationProps) => {
  const handleClick = (handler: () => void) => (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchstart') {
      // For touch events, we need to be more aggressive in preventing default behavior
      e.preventDefault();
      e.stopPropagation();
      handler();
      return false;
    }
    
    e.preventDefault();
    e.stopPropagation();
    handler();
  };

  return (
    <div 
      className="flex items-center space-x-2" 
      onClick={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onClick={handleClick(onPreviousMonth)}
        onTouchStart={handleClick(onPreviousMonth)}
        className="hover:bg-gray-100 transition-colors touch-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onClick={handleClick(onNextMonth)}
        onTouchStart={handleClick(onNextMonth)}
        className="hover:bg-gray-100 transition-colors touch-none"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarNavigation;
