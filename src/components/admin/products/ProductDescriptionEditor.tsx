
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useCallback, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill-custom.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductDescriptionEditorProps {
  form: UseFormReturn<any>;
}

const ProductDescriptionEditor = ({ form }: ProductDescriptionEditorProps) => {
  const { toast } = useToast();

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `descriptions/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Insert image into editor
        const quill = (window as any).quillEditor;
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', publicUrl);
        }

        toast({
          title: "تم رفع الصورة بنجاح",
          description: "تم إدراج الصورة في الوصف",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع الصورة",
          variant: "destructive",
        });
      }
    };
  }, [toast]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [imageHandler]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'script'
  ];

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>الوصف</FormLabel>
          <FormControl>
            <div className="min-h-[200px]">
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                modules={modules}
                formats={formats}
                placeholder="أدخل وصف المنتج..."
                style={{ minHeight: "150px" }}
                ref={(el) => {
                  if (el) {
                    (window as any).quillEditor = el.getEditor();
                  }
                }}
              />
            </div>
          </FormControl>
          <FormDescription>
            يمكنك تنسيق النص وإدراج الصور مباشرة في الوصف
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductDescriptionEditor;
