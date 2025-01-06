import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";

interface JobHeaderProps {
  jobNumber: string;
  title: string;
  status: string;
  onComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isCompletePending: boolean;
  isDeletePending: boolean;
}

const JobHeader = ({
  jobNumber,
  title,
  status,
  onComplete,
  onDelete,
  onEdit,
  isCompletePending,
  isDeletePending,
}: JobHeaderProps) => {
  return (
    <CardHeader className="space-y-4 md:space-y-0 md:flex md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm text-muted-foreground mb-1">{jobNumber}</div>
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        {status !== "completed" && status !== "cancelled" && (
          <>
            <Button
              onClick={onComplete}
              className="bg-green-500 hover:bg-green-600 w-full md:w-auto"
              disabled={isCompletePending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isCompletePending ? "Completing..." : "Mark as Complete"}
            </Button>
            <Button
              onClick={onEdit}
              variant="outline"
              className="w-full md:w-auto"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Job
            </Button>
          </>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full md:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Job</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this job? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isDeletePending}
              >
                {isDeletePending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  );
};

export default JobHeader;