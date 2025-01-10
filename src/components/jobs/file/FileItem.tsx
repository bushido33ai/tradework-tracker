import { FileText } from "lucide-react";
import DeleteFileDialog from "./DeleteFileDialog";

interface FileItemProps {
  file: {
    id: string;
    filename: string;
    file_path: string;
    amount?: number;
  };
  type: "design" | "invoice";
  onFileClick: (filePath: string, filename: string) => void;
  onDelete: (fileId: string, filePath: string) => void;
}

const FileItem = ({ file, type, onFileClick, onDelete }: FileItemProps) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-md group">
      <div
        className="flex-1 flex items-center gap-2 cursor-pointer"
        onClick={() => onFileClick(file.file_path, file.filename)}
      >
        <FileText className="w-4 h-4" />
        <span>{file.filename}</span>
        {type === "invoice" && (
          <span className="text-muted-foreground">
            £{(file as any).amount?.toFixed(2)}
          </span>
        )}
      </div>
      <DeleteFileDialog
        type={type}
        onDelete={() => onDelete(file.id, file.file_path)}
      />
    </div>
  );
};

export default FileItem;