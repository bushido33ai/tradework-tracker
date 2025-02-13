
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEffect, useRef } from "react";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
}

const FileUploadButton = ({ type, isUploading, id }: FileUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current = document.getElementById(id) as HTMLInputElement;
  }, [id]);

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
