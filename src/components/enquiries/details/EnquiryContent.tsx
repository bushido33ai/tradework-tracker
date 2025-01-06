import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface EnquiryContentProps {
  description: string;
  measurementNotes?: string | null;
  location: string;
  visitDate?: string | null;
}

export const EnquiryContent = ({
  description,
  measurementNotes,
  location,
  visitDate,
}: EnquiryContentProps) => {
  return (
    <div className="grid gap-4">
      <div>
        <h3 className="font-medium">Description</h3>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {measurementNotes && (
        <div>
          <h3 className="font-medium">Measurement Notes</h3>
          <p className="text-muted-foreground mt-1">{measurementNotes}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>📍 {location}</span>
        {visitDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(visitDate), "PPP")}
          </span>
        )}
      </div>
    </div>
  );
};