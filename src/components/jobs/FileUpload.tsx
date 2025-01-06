import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileUploadProps {
  jobId: string;
  type: "design" | "invoice";
  onUploadComplete?: () => void;
}

const FileUpload = ({ jobId, type, onUploadComplete }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    cameraInput.onchange = handleFileUpload;
    cameraInput.click();
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        id={`file-upload-${type}`}
        className="hidden"
        onChange={handleFileUpload}
        accept={type === "design" ? "image/*,.pdf" : ".pdf"}
        disabled={isUploading}
      />
      <label htmlFor={`file-upload-${type}`}>
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span>
            <Upload className="w-4 h-4 mr-2" />
            Upload {type === "design" ? "Design" : "Invoice"}
          </span>
        </Button>
      </label>
      
      {isMobile && type === "design" && (
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={isUploading}
          onClick={handleCameraCapture}
        >
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      )}
    </div>
  );
};

export default FileUpload;