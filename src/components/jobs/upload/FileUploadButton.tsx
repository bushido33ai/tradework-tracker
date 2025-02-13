
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  type: "design" | "invoice";
  isUploading: boolean;
  id: string;
}

const FileUploadButton = ({ type, isUploading, id }: FileUploadButtonProps) => {
  return (
    <div className="inline-block">
      <input
        type="file"
        id={id}
        className="hidden"
        accept={type === "design" ? "image/*,.pdf" : ".pdf,image/*"}
        disabled={isUploading}
      />
      <label htmlFor={id}>
        <div className="cursor-pointer inline-block">
          <RainbowButton disabled={isUploading} type="button">
            <Upload className="w-4 h-4 mr-2" />
            Upload {type === "design" ? "Design" : "Invoice"}
          </RainbowButton>
        </div>
      </label>
    </div>
  );
};

export default FileUploadButton;
