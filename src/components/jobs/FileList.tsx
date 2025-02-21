
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FileItem from "./file/FileItem";
import { Loader2 } from "lucide-react";

interface FileListProps {
  jobId: string;
  type: "design" | "invoice";
}

const FileList = ({ jobId, type }: FileListProps) => {
  const queryClient = useQueryClient();
  
  const { data: files, isLoading } = useQuery({
    queryKey: ["files", type, jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type === "design" ? "job_designs" : "job_invoices")
        .select("*")
        .eq("job_id", jobId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleFileClick = async (filePath: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(type === "design" ? "designs" : "invoices")
        .createSignedUrl(filePath, 300); // 5 minutes expiry

      if (error) {
        console.error("Error creating signed URL:", error);
        toast.error("Failed to open file");
        return;
      }

      // Create an invisible anchor element and trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = filename; // Set the download attribute
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Failed to open file");
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
        .from(type === "design" ? "job_designs" : "job_invoices")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;

      // Invalidate the query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["files", type, jobId] });

      toast.success(`${type === "design" ? "Design" : "Invoice"} deleted successfully`);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete ${type === "design" ? "design" : "invoice"}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!files?.length) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No {type === "design" ? "designs" : "invoices"} uploaded yet
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

