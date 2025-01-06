import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CameraButtonProps {
  isUploading: boolean;
  onCapture: () => void;
}

const CameraButton = ({ isUploading, onCapture }: CameraButtonProps) => {
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      disabled={isUploading}
      onClick={onCapture}
    >
      <Camera className="w-4 h-4 mr-2" />
      Take Photo
    </Button>
  );
};

export default CameraButton;