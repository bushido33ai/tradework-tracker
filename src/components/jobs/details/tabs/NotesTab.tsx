
import { Card } from "@/components/ui/card";
import JobNotes from "../JobNotes";

interface NotesTabProps {
  jobId: string;
}

export const NotesTab = ({ jobId }: NotesTabProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <JobNotes jobId={jobId} />
      </div>
    </Card>
  );
};
