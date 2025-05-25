
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ProductBasicFields from "./ProductBasicFields";
import ProductPriceFields from "./ProductPriceFields";
import ProductCategoryField from "./ProductCategoryField";
import ProductImageField from "./ProductImageField";
import ProductStatusFields from "./ProductStatusFields";
import { productSchema, ProductFormData } from "./productSchema";

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

const ProductDialog = ({
  open,
  onOpenChange,
  product,
  categories,
  onSave,
}: ProductDialogProps) => {
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      old_price: null,
      description: "",
      category_id: undefined,
      in_stock: true,
      featured: false,
      images: "",
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
        images: Array.isArray(product.images) ? product.images.join(',') : (product.images || ""),
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
        images: "",
      });
    }
  }, [product, form]);

  const onSubmit = (data: ProductFormData) => {
    // Convert images string back to array for saving
    const formattedData = {
      ...data,
      images: data.images ? data.images.split(',').filter(url => url.trim()) : []
    };
    onSave(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <ProductBasicFields form={form} />
            <ProductPriceFields form={form} />
            <ProductCategoryField form={form} categories={categories} />
            <ProductImageField form={form} />
            <ProductStatusFields form={form} />

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
