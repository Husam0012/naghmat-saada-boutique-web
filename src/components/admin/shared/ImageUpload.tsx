
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

const ImageUpload = ({ 
  label, 
  value, 
  onChange, 
  className = "",
  multiple = false,
  maxFiles = 1 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      if (multiple) {
        const uploadPromises = Array.from(files).slice(0, maxFiles).map(uploadImage);
        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter(url => url !== null) as string[];
        
        if (validUrls.length > 0) {
          const existingUrls = value ? value.split(',').filter(url => url.trim()) : [];
          const allUrls = [...existingUrls, ...validUrls];
          onChange(allUrls.join(','));
          toast({
            title: "تم رفع الصور بنجاح",
            description: `تم رفع ${validUrls.length} صورة`,
          });
        }
      } else {
        const uploadedUrl = await uploadImage(files[0]);
        if (uploadedUrl) {
          onChange(uploadedUrl);
          toast({
            title: "تم رفع الصورة بنجاح",
            description: "تم رفع الصورة بنجاح",
          });
        }
      }
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeImage = (urlToRemove?: string) => {
    if (multiple && urlToRemove) {
      const urls = value.split(',').filter(url => url.trim() && url !== urlToRemove);
      onChange(urls.join(','));
    } else {
      onChange('');
    }
  };

  const getImageUrls = () => {
    if (!value) return [];
    return value.split(',').filter(url => url.trim());
  };

  const imageUrls = getImageUrls();

  return (
    <div className={className}>
      <Label>{label}</Label>
      
      {/* Upload Button */}
      <div className="mt-2">
        <Input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id={`file-upload-${label}`}
        />
        <Label htmlFor={`file-upload-${label}`}>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <div>
              {isUploading ? (
                "جاري الرفع..."
              ) : (
                <>
                  <Upload className="ml-2 h-4 w-4" />
                  {multiple ? "رفع صور" : "رفع صورة"}
                </>
              )}
            </div>
          </Button>
        </Label>
      </div>

      {/* Image Previews */}
      {imageUrls.length > 0 && (
        <div className="mt-4 space-y-2">
          {multiple ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(url)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imageUrls[0]}
                alt="معاينة الصورة"
                className="w-32 h-24 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => removeImage()}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* No Image Placeholder */}
      {imageUrls.length === 0 && (
        <div className="mt-2 w-32 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
