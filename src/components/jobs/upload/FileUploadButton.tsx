import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
}

const FileUploadButton = ({ type, isUploading, id }: FileUploadButtonProps) => {
  return (
    <label htmlFor={`file-upload-${type}`}>
      <Button
        variant="outline"
        className="cursor-pointer"
        disabled={isUploading}
        asChild
      >
        <span>
          <Upload className="w-4 h-4 mr-2" />
          Upload {type === "design" ? "Design" : "Invoice"}
        </span>
      </Button>
    </label>
  );
};

export default FileUploadButton;