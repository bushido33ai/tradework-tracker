import { useIsMobile } from "@/hooks/use-mobile";
import FileUploadButton from "./upload/FileUploadButton";
import { useFileUpload } from "./upload/useFileUpload";

interface FileUploadProps {
  enquiryId: string;
  onUploadComplete?: () => void;
}

const FileUpload = ({ enquiryId, onUploadComplete }: FileUploadProps) => {
  const { isUploading, handleFileUpload } = useFileUpload({
    enquiryId,
    onUploadComplete,
  });

  return (
    <div className="flex gap-2">
      <input
        type="file"
        id="file-upload-design"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        disabled={isUploading}
      />
      <FileUploadButton 
        type="design" 
        isUploading={isUploading} 
        id="file-upload-design" 
      />
    </div>
  );
};

export default FileUpload;