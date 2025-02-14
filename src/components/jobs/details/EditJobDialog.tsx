
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import JobFormFields from "@/components/jobs/JobFormFields";
import { UseFormReturn } from "react-hook-form";
import { JobFormValues } from "@/components/jobs/types";
import { UseMutationResult } from "@tanstack/react-query";

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<JobFormValues>;
  updateJobMutation: UseMutationResult<void, Error, JobFormValues>;
}

export const EditJobDialog = ({
  open,
  onOpenChange,
  form,
  updateJobMutation,
}: EditJobDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => updateJobMutation.mutate(values))} className="space-y-4">
            <JobFormFields form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-2 hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateJobMutation.isPending}
                className="bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {updateJobMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
