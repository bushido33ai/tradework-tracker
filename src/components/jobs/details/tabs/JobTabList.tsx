
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobTabListProps {
  isDayRate: boolean;
  showBudget: boolean;
}

export const JobTabList = ({ isDayRate, showBudget }: JobTabListProps) => {
  return (
    <TabsList className="w-full flex bg-white/90 backdrop-blur-sm border-b overflow-x-auto scrollbar-none">
      <TabsTrigger 
        value="designs" 
        className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
      >
        Designs
      </TabsTrigger>
      {isDayRate && (
        <TabsTrigger 
          value="days-worked" 
          className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Days
        </TabsTrigger>
      )}
      <TabsTrigger 
        value="invoices" 
        className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
      >
        Invoices
      </TabsTrigger>
      <TabsTrigger 
        value="payments" 
        className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
      >
        Payments
      </TabsTrigger>
      <TabsTrigger 
        value="extras" 
        className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
      >
        Extras
      </TabsTrigger>
      <TabsTrigger 
        value="notes" 
        className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
      >
        Notes
      </TabsTrigger>
      <TabsTrigger 
        value="running-total" 
        className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
      >
        Running Total
      </TabsTrigger>
      {showBudget && (
        <TabsTrigger 
          value="budget" 
          className="flex-1 min-w-[100px] font-medium data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-inner data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all duration-200"
        >
          Budget
        </TabsTrigger>
      )}
    </TabsList>
  );
};
