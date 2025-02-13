
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
}

const FileUploadButton = ({ type, isUploading, id }: FileUploadButtonProps) => {
  return (
    <label htmlFor={id}>
      <RainbowButton className="cursor-pointer" disabled={isUploading} type="button">
        <Upload className="w-4 h-4 mr-2" />
        Upload {type === "design" ? "Design" : "Invoice"}
      </RainbowButton>
    </label>
  );
};

export default FileUploadButton;
