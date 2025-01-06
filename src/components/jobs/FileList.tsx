import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

interface FileListProps {
  jobId: string;
  type: "design" | "invoice";
}

const FileList = ({ jobId, type }: FileListProps) => {
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
          className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
          onClick={() => handleFileClick(file.file_path, file.filename)}
        >
          <FileText className="w-4 h-4" />
          <span className="flex-1">{file.filename}</span>
          {type === "invoice" && (
            <span className="text-muted-foreground">
              ${(file as any).amount?.toFixed(2)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;