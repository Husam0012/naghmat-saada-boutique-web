
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/services/auth.service";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  category?: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  };
}

const formSchema = z.object({
  name: z.string().min(1, { message: "اسم التصنيف مطلوب" }),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

const CategoryDialog = ({
  open,
  onOpenChange,
  mode,
  category,
}: CategoryDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && category) {
      form.reset({
        name: category.name,
        description: category.description ?? "",
        image_url: category.image_url ?? "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        image_url: "",
      });
    }
  }, [form, category, mode, open]);

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      dataService.createCategory({
        name: values.name,
        description: values.description || null,
        image_url: values.image_url || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({
        title: "تم الإضافة",
        description: "تم إضافة التصنيف بنجاح",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة التصنيف",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      dataService.updateCategory(category?.id || "", {
        name: values.name,
        description: values.description || null,
        image_url: values.image_url || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث التصنيف بنجاح",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث التصنيف",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (mode === "add") {
      createMutation.mutate(values);
    } else if (mode === "edit" && category) {
      updateMutation.mutate(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "إضافة تصنيف جديد" : "تعديل التصنيف"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم التصنيف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم التصنيف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل وصف التصنيف (اختياري)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصورة</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل رابط صورة التصنيف (اختياري)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "جاري الحفظ..."
                  : mode === "add"
                  ? "إضافة"
                  : "حفظ التغييرات"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
