import { useIsMobile } from "@/hooks/use-mobile";
import FileUploadButton from "./upload/FileUploadButton";
import CameraButton from "./upload/CameraButton";
import { useFileUpload } from "./upload/useFileUpload";

interface FileUploadProps {
  jobId: string;
  type: "design" | "invoice";
  onUploadComplete?: () => void;
}

const FileUpload = ({ jobId, type, onUploadComplete }: FileUploadProps) => {
  const isMobile = useIsMobile();
  const { isUploading, handleFileUpload, handleCameraCapture } = useFileUpload({
    jobId,
    type,
    onUploadComplete,
  });

  return (
    <div className="flex gap-2">
      <input
        type="file"
        id={`file-upload-${type}`}
        className="hidden"
        onChange={handleFileUpload}
        accept={type === "design" ? "image/*,.pdf" : ".pdf,image/*"}
        disabled={isUploading}
      />
      <FileUploadButton 
        type={type} 
        isUploading={isUploading} 
        id={`file-upload-${type}`} 
      />
      
      {isMobile && (
        <CameraButton 
          isUploading={isUploading}
          onCapture={handleCameraCapture}
        />
      )}
    </div>
  );
};

export default FileUpload;