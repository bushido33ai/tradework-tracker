
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image, Camera, File } from "lucide-react";
import { RefObject } from "react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "design" | "invoice";
  inputRef: RefObject<HTMLInputElement>;
}

const UploadDialog = ({ open, onOpenChange, type, inputRef }: UploadDialogProps) => {
  const handleFileUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {type === "design" ? "Design" : "Invoice"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <Button
            variant="outline"
            onClick={handleFileUpload}
            className="justify-start"
          >
            <File className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          <Button
            variant="outline"
            onClick={handleFileUpload}
            className="justify-start"
          >
            <Image className="mr-2 h-4 w-4" />
            Choose Photo
          </Button>
          <Button
            variant="outline"
            onClick={handleFileUpload}
            className="justify-start"
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
