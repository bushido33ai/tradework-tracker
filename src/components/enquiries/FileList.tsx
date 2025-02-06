import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FileItem from "./file/FileItem";
import { Loader2 } from "lucide-react";

interface FileListProps {
  enquiryId: string;
}

const FileList = ({ enquiryId }: FileListProps) => {
  const queryClient = useQueryClient();
  
  const { data: files, isLoading } = useQuery({
    queryKey: ["enquiry-designs", enquiryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiry_designs")
        .select("*")
        .eq("enquiry_id", enquiryId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleFileClick = async (filePath: string, filename: string) => {
    const { data, error } = await supabase.storage
      .from("enquiry-designs")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error("Error creating signed URL:", error);
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("enquiry-designs")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("enquiry_designs")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;

      // Invalidate the query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["enquiry-designs", enquiryId] });

      toast.success("Design deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete design");
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
        No designs uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onFileClick={handleFileClick}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default FileList;