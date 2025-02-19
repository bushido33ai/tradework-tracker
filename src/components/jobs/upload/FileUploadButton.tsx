
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { RefObject, useState } from "react";
import UploadDialog from "./UploadDialog";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
  inputRef: RefObject<HTMLInputElement>;
}

const FileUploadButton = ({ type, isUploading, inputRef }: FileUploadButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="default"
        className="cursor-pointer bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        disabled={isUploading}
        type="button"
        onClick={() => setOpen(true)}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload {type === "design" ? "Design" : "Invoice"}
      </Button>

      <UploadDialog
        open={open}
        onOpenChange={setOpen}
        type={type}
        inputRef={inputRef}
      />
    </>
  );
};

export default FileUploadButton;
