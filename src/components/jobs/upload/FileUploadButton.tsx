
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { RefObject } from "react";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
  inputRef: RefObject<HTMLInputElement>;
}

const FileUploadButton = ({ type, isUploading, inputRef }: FileUploadButtonProps) => {
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    } else {
      console.error('File input element not found');
    }
  };

  return (
    <Button 
      variant="outline"
      className="cursor-pointer"
      disabled={isUploading}
      type="button"
      onClick={handleClick}
    >
      <Upload className="w-4 h-4 mr-2" />
      Upload {type === "design" ? "Design" : "Invoice"}
    </Button>
  );
};

export default FileUploadButton;
