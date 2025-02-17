
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarNavigation = ({ onPreviousMonth, onNextMonth }: CalendarNavigationProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onTouchEnd={(e) => {
          e.preventDefault();
          onPreviousMonth();
        }}
        onClick={(e) => {
          e.preventDefault();
          onPreviousMonth();
        }}
        className="hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        onTouchEnd={(e) => {
          e.preventDefault();
          onNextMonth();
        }}
        onClick={(e) => {
          e.preventDefault();
          onNextMonth();
        }}
        className="hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarNavigation;
