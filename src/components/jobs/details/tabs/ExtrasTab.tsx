import { Card } from "@/components/ui/card";
import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import ExtrasForm from "../ExtrasForm";
import { ExtrasList } from "../ExtrasList";

interface ExtrasTabProps {
  jobId: string;
}

export const ExtrasTab = ({ jobId }: ExtrasTabProps) => {
  const [showExtrasForm, setShowExtrasForm] = useState(false);

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-2">
            <h4 className="font-medium">Job Extras</h4>
            <RainbowButton
              onClick={() => setShowExtrasForm(!showExtrasForm)}
            >
              {showExtrasForm ? "Cancel" : "Add Extra"}
            </RainbowButton>
          </div>
        </div>

        {showExtrasForm && (
          <div className="mb-4">
            <ExtrasForm 
              jobId={jobId} 
              onSuccess={() => setShowExtrasForm(false)} 
            />
          </div>
        )}

        <div className="mb-4">
          <ExtrasList jobId={jobId} />
        </div>
      </div>
    </Card>
  );
};
