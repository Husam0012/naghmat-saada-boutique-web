
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Offer } from "./OffersManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";
import { Switch } from "@/components/ui/switch";

interface OfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  categories: Tables<"categories">[];
  products: Tables<"products">[];
  onSave: (data: any) => void;
}

const offerSchema = z.object({
  title: z.string().min(1, { message: "العنوان مطلوب" }),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "amount"]),
  discount_value: z.string().min(1, { message: "قيمة الخصم مطلوبة" }),
  target_type: z.enum(["all", "category", "product"]),
  target_id: z.string().optional(),
  start_date: z.string().min(1, { message: "تاريخ البدء مطلوب" }),
  end_date: z.string().min(1, { message: "تاريخ الانتهاء مطلوب" }),
  is_active: z.boolean().default(true),
});

const OfferDialog = ({
  open,
  onOpenChange,
  offer,
  categories,
  products,
  onSave,
}: OfferDialogProps) => {
  const isEditing = !!offer;

  let discountType = "percentage";
  let discountValue = "";
  let targetType = "all";
  let targetId = "";

  if (offer) {
    discountType = offer.discount_percentage ? "percentage" : "amount";
    discountValue = offer.discount_percentage
      ? String(offer.discount_percentage)
      : offer.discount_amount
      ? String(offer.discount_amount)
      : "";
    
    if (offer.applies_to_category_id) {
      targetType = "category";
      targetId = offer.applies_to_category_id.id;
    } else if (offer.applies_to_product_id) {
      targetType = "product";
      targetId = offer.applies_to_product_id.id;
    } else {
      targetType = "all";
    }
  }

  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      discount_type: discountType as "percentage" | "amount",
      discount_value: discountValue,
      target_type: targetType as "all" | "category" | "product",
      target_id: targetId,
      start_date: offer?.start_date
        ? new Date(offer.start_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      end_date: offer?.end_date
        ? new Date(offer.end_date).toISOString().split("T")[0]
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      is_active: offer?.is_active !== false,
    },
  });

  const discountType = form.watch("discount_type");
  const targetType = form.watch("target_type");

  useEffect(() => {
    if (open && offer) {
      form.reset({
        title: offer.title,
        description: offer.description || "",
        discount_type: offer.discount_percentage ? "percentage" : "amount",
        discount_value: offer.discount_percentage
          ? String(offer.discount_percentage)
          : offer.discount_amount
          ? String(offer.discount_amount)
          : "",
        target_type: offer.applies_to_category_id
          ? "category"
          : offer.applies_to_product_id
          ? "product"
          : "all",
        target_id: offer.applies_to_category_id
          ? offer.applies_to_category_id.id
          : offer.applies_to_product_id
          ? offer.applies_to_product_id.id
          : "",
        start_date: new Date(offer.start_date).toISOString().split("T")[0],
        end_date: new Date(offer.end_date).toISOString().split("T")[0],
        is_active: offer.is_active !== false,
      });
    } else if (open) {
      form.reset({
        title: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        target_type: "all",
        target_id: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        is_active: true,
      });
    }
  }, [open, offer, form]);

  const onSubmit = (values: z.infer<typeof offerSchema>) => {
    // Prepare the data for saving
    const offerData: any = {
      title: values.title,
      description: values.description || null,
      start_date: values.start_date,
      end_date: values.end_date,
      is_active: values.is_active,
    };

    // Set discount fields
    if (values.discount_type === "percentage") {
      offerData.discount_percentage = Number(values.discount_value);
      offerData.discount_amount = null;
    } else {
      offerData.discount_amount = Number(values.discount_value);
      offerData.discount_percentage = null;
    }

    // Set target fields
    if (values.target_type === "category" && values.target_id) {
      offerData.applies_to_category_id = values.target_id;
      offerData.applies_to_product_id = null;
    } else if (values.target_type === "product" && values.target_id) {
      offerData.applies_to_product_id = values.target_id;
      offerData.applies_to_category_id = null;
    } else {
      offerData.applies_to_category_id = null;
      offerData.applies_to_product_id = null;
    }

    onSave(offerData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "تعديل العرض" : "إضافة عرض جديد"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان العرض</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان العرض" {...field} />
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
                  <FormLabel>الوصف (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل وصف العرض"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الخصم</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الخصم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية</SelectItem>
                        <SelectItem value="amount">قيمة ثابتة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {discountType === "percentage"
                        ? "النسبة المئوية"
                        : "القيمة"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={
                          discountType === "percentage" ? "مثال: 10" : "مثال: 50"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="target_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>يطبق على</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر هدف العرض" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">جميع المنتجات</SelectItem>
                      <SelectItem value="category">تصنيف محدد</SelectItem>
                      <SelectItem value="product">منتج محدد</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {targetType !== "all" && (
              <FormField
                control={form.control}
                name="target_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {targetType === "category" ? "التصنيف" : "المنتج"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              targetType === "category"
                                ? "اختر التصنيف"
                                : "اختر المنتج"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {targetType === "category"
                          ? categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          : products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البداية</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ النهاية</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>نشط</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">
                {isEditing ? "تحديث العرض" : "إضافة العرض"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDialog;
