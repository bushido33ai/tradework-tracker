
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/jobs/FileUpload";
import FileList from "@/components/jobs/FileList";
import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { MiscCostForm } from "../MiscCostForm";
import { MiscCostsList } from "../MiscCostsList";

interface InvoicesTabProps {
  jobId: string;
}

export const InvoicesTab = ({ jobId }: InvoicesTabProps) => {
  const [showMiscCostForm, setShowMiscCostForm] = useState(false);

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-2">
            <h4 className="font-medium">Miscellaneous Costs</h4>
            <RainbowButton
              onClick={() => setShowMiscCostForm(!showMiscCostForm)}
            >
              {showMiscCostForm ? "Cancel" : "Add Cost"}
            </RainbowButton>
          </div>
          <div className="flex items-end">
            <FileUpload jobId={jobId} type="invoice" />
          </div>
        </div>

        {showMiscCostForm && (
          <div className="mb-4">
            <MiscCostForm 
              jobId={jobId} 
              onSuccess={() => setShowMiscCostForm(false)} 
            />
          </div>
        )}

        <div className="mb-4">
          <MiscCostsList jobId={jobId} />
        </div>

        <FileList jobId={jobId} type="invoice" />
      </div>
    </Card>
  );
};
