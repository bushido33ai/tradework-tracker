
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
}

const FileUploadButton = ({ type, isUploading, id }: FileUploadButtonProps) => {
  const handleClick = () => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.click();
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
