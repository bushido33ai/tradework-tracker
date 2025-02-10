
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import FileUpload from "@/components/jobs/FileUpload";
import JobNotes from "@/components/jobs/details/JobNotes";
import FileList from "@/components/jobs/FileList";

interface MerchantJobCardProps {
  job: {
    id: string;
    job_number: string;
    title: string;
  };
}

const MerchantJobCard = ({ job }: MerchantJobCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground">{job.job_number}</div>
        <h3 className="text-xl font-semibold">{job.title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Invoices</h4>
          <FileUpload jobId={job.id} type="invoice" />
          <div className="mt-2">
            <FileList jobId={job.id} type="invoice" />
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Notes</h4>
          <JobNotes jobId={job.id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantJobCard;
