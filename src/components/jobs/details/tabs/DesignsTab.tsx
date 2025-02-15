
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";

interface DesignsTabProps {
  jobId: string;
}

export const DesignsTab = ({ jobId }: DesignsTabProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <FileUpload jobId={jobId} type="design" />
        </div>
        <FileList jobId={jobId} type="design" />
      </div>
    </Card>
  );
};
