import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import FileList from "../FileList";
import FileUpload from "../FileUpload";
interface EnquiryContentProps {
  id: string;
  description: string;
  measurementNotes?: string | null;
  location: string;
  visitDate?: string | null;
}
export const EnquiryContent = ({
  id,
  description,
  measurementNotes,
  location,
  visitDate
}: EnquiryContentProps) => {
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary bg-blue-50">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary bg-blue-50">
          <h3 className="font-semibold mb-2">Location</h3>
          <p className="text-muted-foreground">{location}</p>
          {visitDate && <>
              <h3 className="font-semibold mb-2 mt-4">Visit Date</h3>
              <p className="text-muted-foreground">
                {format(new Date(visitDate), "PPP")}
              </p>
            </>}
        </Card>
      </div>

      {measurementNotes && <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-2">Measurement Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {measurementNotes}
          </p>
        </Card>}

      <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary bg-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Designs</h3>
          <FileUpload enquiryId={id} />
        </div>
        <FileList enquiryId={id} />
      </Card>
    </div>;
};