import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import EnquiryFormFields from "@/components/enquiries/EnquiryFormFields";
import { UseFormReturn } from "react-hook-form";
import { EnquiryFormValues } from "@/components/enquiries/types";
import { UseMutationResult } from "@tanstack/react-query";

interface EditEnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EnquiryFormValues>;
  updateEnquiryMutation: UseMutationResult<void, Error, EnquiryFormValues>;
}

export const EditEnquiryDialog = ({
  open,
  onOpenChange,
  form,
  updateEnquiryMutation,
}: EditEnquiryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Enquiry</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => updateEnquiryMutation.mutate(values))} className="space-y-4">
            <EnquiryFormFields form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateEnquiryMutation.isPending}>
                {updateEnquiryMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};