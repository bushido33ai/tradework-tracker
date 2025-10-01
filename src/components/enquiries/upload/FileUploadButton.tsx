import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
interface FileUploadButtonProps {
  type: "design";
  isUploading: boolean;
  id: string;
}
const FileUploadButton = ({
  isUploading,
  id
}: FileUploadButtonProps) => {
  return <label htmlFor={id} className="bg-slate-300">
      <Button variant="outline" className="cursor-pointer" disabled={isUploading} asChild>
        <span>
          <Upload className="w-4 h-4 mr-2" />
          Upload Design
        </span>
      </Button>
    </label>;
};
export default FileUploadButton;