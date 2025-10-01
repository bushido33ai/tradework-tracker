import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Trash2, Pencil } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
interface EnquiryActionsProps {
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  status?: string;
  completeEnquiryMutation: UseMutationResult<void, Error, void>;
  deleteEnquiryMutation: UseMutationResult<void, Error, void>;
}
export const EnquiryActions = ({
  showEditDialog,
  setShowEditDialog,
  status,
  completeEnquiryMutation,
  deleteEnquiryMutation
}: EnquiryActionsProps) => {
  return <div className="flex flex-col md:flex-row gap-2">
      <Button variant="outline" onClick={() => setShowEditDialog(true)} className="w-full md:w-auto bg-slate-300 hover:bg-slate-200">
        <Pencil className="mr-2 h-4 w-4" />
        Edit Enquiry
      </Button>
      {status !== "completed" && status !== "cancelled" && <Button onClick={() => completeEnquiryMutation.mutate()} className="bg-green-500 hover:bg-green-600 w-full md:w-auto" disabled={completeEnquiryMutation.isPending}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {completeEnquiryMutation.isPending ? "Completing..." : "Mark as Complete"}
        </Button>}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="w-full md:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Enquiry
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={() => deleteEnquiryMutation.mutate()} disabled={deleteEnquiryMutation.isPending}>
              {deleteEnquiryMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};