
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarNavigation = ({ onPreviousMonth, onNextMonth }: CalendarNavigationProps) => {
  const handleClick = (handler: () => void) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handler();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onClick={handleClick(onPreviousMonth)}
        className="hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onClick={handleClick(onNextMonth)}
        className="hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarNavigation;
