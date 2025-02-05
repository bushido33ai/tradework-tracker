import { useState } from "react";
import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import EnquiriesList from "@/components/enquiries/EnquiriesList";
import AddEnquiryDialog from "@/components/enquiries/AddEnquiryDialog";
import { Separator } from "@/components/ui/separator";

const Enquiries = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enquiries</h1>
          <p className="text-muted-foreground mt-2">
            Manage your enquiries and schedule site visits
          </p>
        </div>
        <GradientButton 
          onClick={() => setShowAddDialog(true)}
          className="px-6 py-2.5 text-base h-10"
        >
          <span className="inline-flex items-center justify-center">
            <Plus className="mr-2 h-5 w-5" />
            Create Enquiry
          </span>
        </GradientButton>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Enquiries</h2>
          <EnquiriesList status={["pending", "in_progress"]} />
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Completed Enquiries</h2>
          <EnquiriesList status={["completed"]} />
        </div>
      </div>
      
      <AddEnquiryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default Enquiries;