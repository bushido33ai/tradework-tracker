import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseFileUploadProps {
  jobId: string;
  type: "design" | "invoice";
  onUploadComplete?: () => void;
}

export const useFileUpload = ({ jobId, type, onUploadComplete }: UseFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${jobId}/${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from(type === "design" ? "designs" : "invoices")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      let amount: number | undefined;
      if (type === "invoice") {
        const amountStr = prompt("Please enter the invoice amount:");
        if (!amountStr) return;
        amount = parseFloat(amountStr);
        if (isNaN(amount)) {
          toast({
            title: "Invalid amount",
            description: "Please enter a valid number",
            variant: "destructive",
          });
          return;
        }
      }

      const { error: dbError } = await supabase
        .from(type === "design" ? "job_designs" : "job_invoices")
        .insert({
          job_id: jobId,
          filename: file.name,
          file_path: filePath,
          ...(amount && { amount }),
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: `${type === "design" ? "Design" : "Invoice"} has been uploaded.`,
      });

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleCameraCapture = () => {
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment'; // Use the back camera
    
    // Create a wrapper function to handle the DOM event
    cameraInput.onchange = (e: Event) => {
      if (e.target instanceof HTMLInputElement) {
        handleFileUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };
    
    cameraInput.click();
  };

  return {
    isUploading,
    handleFileUpload,
    handleCameraCapture,
  };
};