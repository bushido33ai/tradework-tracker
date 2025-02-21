
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import FileItem from "./file/FileItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileListProps {
  jobId: string;
  type: "design" | "invoice";
}

const FileList = ({ jobId, type }: FileListProps) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const { data: files } = useQuery({
    queryKey: ["files", jobId, type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(`job_${type}s`)
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleFileClick = async (filePath: string, filename: string) => {
    try {
      setIsLoading(true);
      const { data: { signedUrl }, error } = await supabase.storage
        .from(type === "design" ? "designs" : "invoices")
        .createSignedUrl(filePath, 3600);

      if (error) throw error;

      if (signedUrl) {
        if (isMobile) {
          // For mobile, open in system browser
          window.open(signedUrl, '_system');
        } else {
          // For web, open in new tab
          window.open(signedUrl, '_blank');
        }
      }
    } catch (error) {
      console.error("Error opening file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(type === "design" ? "designs" : "invoices")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from(`job_${type}s`)
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (!files?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No {type}s uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          type={type}
          onFileClick={handleFileClick}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default FileList;
