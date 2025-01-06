import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
    const { data, error } = await supabase.storage
      .from(type === "design" ? "designs" : "invoices")
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
    return <div>Loading files...</div>;
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
        <div
          key={file.id}
          className="flex items-center gap-2 p-2 hover:bg-accent rounded-md group"
        >
          <div
            className="flex-1 flex items-center gap-2 cursor-pointer"
            onClick={() => handleFileClick(file.file_path, file.filename)}
          >
            <FileText className="w-4 h-4" />
            <span>{file.filename}</span>
            {type === "invoice" && (
              <span className="text-muted-foreground">
                ${(file as any).amount?.toFixed(2)}
              </span>
            )}
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {type === "design" ? "Design" : "Invoice"}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this {type === "design" ? "design" : "invoice"}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => handleDelete(file.id, file.file_path)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};

export default FileList;