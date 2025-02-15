
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DayWorked {
  id: string;
  date_worked: string;
  hours_worked: number;
  day_rate_type: string;
  day_rate: number;
  notes: string;
}

interface DaysWorkedTableProps {
  daysWorked: DayWorked[];
  totalDays: number;
  onDeleteClick: (id: string) => void;
}

export const DaysWorkedTable = ({
  daysWorked,
  totalDays,
  onDeleteClick,
}: DaysWorkedTableProps) => {
  if (!daysWorked || daysWorked.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No days worked recorded yet
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Day Rate</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {daysWorked.map((day) => (
            <TableRow key={day.id}>
              <TableCell>{format(new Date(day.date_worked), "PPP")}</TableCell>
              <TableCell>{day.hours_worked}</TableCell>
              <TableCell className="capitalize">{day.day_rate_type || "N/A"}</TableCell>
              <TableCell>£{day.day_rate ? day.day_rate.toFixed(2) : "N/A"}</TableCell>
              <TableCell>{day.notes}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteClick(day.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-sm text-muted-foreground text-right pt-4">
        Total Days Worked: {totalDays}
      </div>
    </>
  );
};
