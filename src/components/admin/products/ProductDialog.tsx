
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  categories: Category[];
  onSave: (data: any) => void;
}

const productSchema = z.object({
  name: z.string().min(3, "اسم المنتج يجب أن يكون على الأقل 3 أحرف"),
  price: z.coerce.number().min(0, "السعر يجب أن يكون أكبر من أو يساوي صفر"),
  old_price: z.coerce.number().min(0).optional().nullable(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  in_stock: z.boolean().default(true),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

const ProductDialog = ({
  open,
  onOpenChange,
  product,
  categories,
  onSave,
}: ProductDialogProps) => {
  const isEditing = !!product;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      old_price: null,
      description: "",
      category_id: undefined,
      in_stock: true,
      featured: false,
      images: [],
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        old_price: product.old_price,
        description: product.description || "",
        category_id: product.category_id?.id || undefined,
        in_stock: product.in_stock !== false,
        featured: !!product.featured,
        images: product.images || [],
      });
    } else {
      form.reset({
        name: "",
        price: 0,
        old_price: null,
        description: "",
        category_id: undefined,
        in_stock: true,
        featured: false,
        images: [],
      });
    }
  }, [product, form]);

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المنتج</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل اسم المنتج" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        placeholder="أدخل السعر"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="old_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر القديم (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseFloat(value));
                        }}
                        placeholder="أدخل السعر القديم"
                      />
                    </FormControl>
                    <FormDescription>
                      للتخفيضات والعروض
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      {...field}
                      placeholder="أدخل وصف المنتج"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التصنيف</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر تصنيف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="in_stock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-reverse space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>متوفر</FormLabel>
                      <FormDescription>
                        هل المنتج متوفر في المخزون؟
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-reverse space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>مميز</FormLabel>
                      <FormDescription>
                        عرض المنتج في قسم المنتجات المميزة
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صور المنتج</FormLabel>
                  <FormDescription>
                    ستتم إضافة دعم رفع الصور في الإصدار القادم. حالياً يمكن إضافة روابط للصور المستضافة خارجياً.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">
                {isEditing ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
