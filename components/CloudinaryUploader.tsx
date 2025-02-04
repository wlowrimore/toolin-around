"use client";

import { CldUploadButton, type CldUploadButtonProps } from "next-cloudinary";
import { useState } from "react";
import { useUpdatePath } from "@/hooks/useUpdatePath";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { toast } from "@/hooks/use-toast";
import { CloudUpload } from "lucide-react";

interface CloudinaryUploaderProps
  extends Omit<CldUploadButtonProps, "onSuccess, options"> {
  onImageUrlChange?: (url: string, deleteToken: string) => void;
  className?: string;
  currentImageUrl?: string;
  currentDeleteToken?: string;
}

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

const CloudinaryUploader = ({
  onImageUrlChange,
  className,
  currentImageUrl,
  ...props
}: CloudinaryUploaderProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const [deleteToken, setDeleteToken] = useState<string | undefined>(
    currentImageUrl
  );

  const { isUpdatePath } = useUpdatePath();
  const buttonText = isUpdatePath ? "Replace Image" : "Upload Images";
  className =
    "text-xl flex flex-col items-center justify-center gap-2 px-6 relative bottom-0 left-[30%] text-white z-50";

  const handleUpload = (result: any) => {
    if (result?.info?.secure_url) {
      const newUrl = result.info.secure_url;
      const newToken = result.info.delete_token;

      setImageUrl(newUrl);
      setDeleteToken(newToken);

      onImageUrlChange?.(newUrl, newToken);

      toast({
        variant: "success",
        title: "Success",
        description: "Image uploaded successfully",
      });
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl || !deleteToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No image or delete token available",
      });
      return;
    }

    try {
      await deleteCloudinaryImage(deleteToken);

      setImageUrl(undefined);
      setDeleteToken(undefined);
      onImageUrlChange?.("", "");

      toast({
        variant: "success",
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove image",
      });
    }
  };

  return (
    <div className="relative space-y-4">
      <div className="h-[7rem]">
        <CldUploadButton
          uploadPreset={cloudPresetName}
          options={{
            multiple: true,
            maxFiles: 4,
            sources: ["local", "camera"],
          }}
          onSuccess={handleUpload}
          className={className}
          {...props}
        >
          {buttonText} <CloudUpload className="w-8 h-8" />
          <p className="text-sm">( Up to 4 images )</p>
        </CldUploadButton>
      </div>
    </div>
  );
};

export default CloudinaryUploader;
