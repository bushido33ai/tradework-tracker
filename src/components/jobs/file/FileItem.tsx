import { FileText, Image } from "lucide-react";
import DeleteFileDialog from "./DeleteFileDialog";
import { formatFileSize } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface FileItemProps {
  file: {
    id: string;
    filename: string;
    file_path: string;
    amount?: number;
    uploaded_at?: string;
  };
  type: "design" | "invoice";
  onFileClick: (filePath: string, filename: string) => void;
  onDelete: (fileId: string, filePath: string) => void;
}

const FileItem = ({ file, type, onFileClick, onDelete }: FileItemProps) => {
  const isImage = file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-accent rounded-md group">
      {isImage ? (
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
          <img
            src={`/storage/${type === "design" ? "designs" : "invoices"}/${file.file_path}`}
            alt={file.filename}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      ) : (
        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-100">
          <FileText className="w-6 h-6 text-gray-500" />
        </div>
      )}
      
      <div
        className="flex-1 cursor-pointer"
        onClick={() => onFileClick(file.file_path, file.filename)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{file.filename}</span>
          {isImage && <Image className="w-4 h-4 text-gray-500" />}
        </div>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <div>
            {type === "invoice" && file.amount && (
              <span className="mr-2">£{file.amount.toFixed(2)}</span>
            )}
            <span>{formatFileSize(file.file_path.length * 1024)}</span>
          </div>
          {file.uploaded_at && (
            <div className="text-xs">
              Uploaded {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
            </div>
          )}
        </div>
      </div>
      
      <DeleteFileDialog
        type={type}
        onDelete={() => onDelete(file.id, file.file_path)}
      />
    </div>
  );
};

export default FileItem;