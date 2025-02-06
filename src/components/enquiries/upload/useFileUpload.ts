import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseFileUploadProps {
  enquiryId: string;
  onUploadComplete?: () => void;
}

export const useFileUpload = ({ enquiryId, onUploadComplete }: UseFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${enquiryId}/${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("enquiry-designs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from("enquiry_designs")
        .insert({
          enquiry_id: enquiryId,
          filename: file.name,
          file_path: filePath,
        });

      if (dbError) throw dbError;

      toast.success("Design has been uploaded");

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload design");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return {
    isUploading,
    handleFileUpload,
  };
};