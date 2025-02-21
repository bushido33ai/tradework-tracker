
import { FileText, Image, Link as LinkIcon } from "lucide-react";
import DeleteFileDialog from "./DeleteFileDialog";
import { formatFileSize } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const isImage = file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isUrl = file.filename.match(/^https?:\/\//i);
  
  useEffect(() => {
    const fetchThumbnailUrl = async () => {
      if (!isImage) return;
      
      try {
        const { data, error } = await supabase.storage
          .from(type === "design" ? "designs" : "invoices")
          .createSignedUrl(file.file_path, 3600);

        if (error) {
          console.error("Error fetching thumbnail URL:", error);
          return;
        }

        if (data?.signedUrl) {
          setThumbnailUrl(data.signedUrl);
        }
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
      }
    };

    fetchThumbnailUrl();
  }, [file.file_path, isImage, type]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFileClick(file.file_path, file.filename);
  };

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-accent rounded-md group">
      <div 
        className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        {isImage ? (
          thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={file.filename}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-6 h-6 text-gray-500" />
            </div>
          )
        ) : isUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <LinkIcon className="w-6 h-6 text-gray-500" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </div>
      
      <div
        className="flex-1 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{file.filename}</span>
          {isImage && <Image className="w-4 h-4 text-gray-500" />}
          {isUrl && <LinkIcon className="w-4 h-4 text-gray-500" />}
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
