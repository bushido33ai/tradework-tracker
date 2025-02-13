
import FileUploadButton from "./upload/FileUploadButton";
import { useFileUpload } from "./upload/useFileUpload";

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

  return (
    <div className="flex gap-2">
      <FileUploadButton 
        type={type} 
        isUploading={isUploading} 
        id={`file-upload-${type}`} 
      />
      <input
        type="file"
        id={`file-upload-${type}`}
        className="hidden"
        onChange={handleFileUpload}
        accept={type === "design" ? "image/*,.pdf" : ".pdf,image/*"}
        capture="environment"
        disabled={isUploading}
      />
    </div>
  );
};

export default FileUpload;
