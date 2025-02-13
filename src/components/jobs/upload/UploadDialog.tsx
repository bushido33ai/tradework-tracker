
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
  const handleFileUpload = (mode: 'file' | 'gallery' | 'camera') => {
    if (inputRef.current) {
      // Remove any existing capture attribute
      inputRef.current.removeAttribute('capture');
      
      // Set appropriate accept and capture attributes based on mode
      switch (mode) {
        case 'file':
          inputRef.current.accept = ".pdf";
          break;
        case 'gallery':
          inputRef.current.accept = "image/*";
          break;
        case 'camera':
          inputRef.current.accept = "image/*";
          inputRef.current.setAttribute('capture', 'environment');
          break;
      }
      
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
            onClick={() => handleFileUpload('file')}
            className="justify-start"
          >
            <File className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          <Button
            variant="outline"
            onClick={() => handleFileUpload('gallery')}
            className="justify-start"
          >
            <Image className="mr-2 h-4 w-4" />
            Choose Photo
          </Button>
          <Button
            variant="outline"
            onClick={() => handleFileUpload('camera')}
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
