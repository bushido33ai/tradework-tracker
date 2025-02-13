
import FileUploadButton from "./upload/FileUploadButton";
import { useFileUpload } from "./upload/useFileUpload";
import { useRef } from "react";

interface FileUploadProps {
  jobId: string;
  type: "design" | "invoice";
  onUploadComplete?: () => void;
}

const FileUpload = ({ jobId, type, onUploadComplete }: FileUploadProps) => {
  const { isUploading, handleFileUpload } = useFileUpload({
    jobId,
    type,
    onUploadComplete,
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="file"
        id={`file-upload-${type}`}
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        capture="environment"
        disabled={isUploading}
      />
      <FileUploadButton 
        type={type} 
        isUploading={isUploading} 
        id={`file-upload-${type}`}
        inputRef={inputRef}
      />
    </div>
  );
};

export default FileUpload;
