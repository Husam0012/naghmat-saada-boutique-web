import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tables } from "@/integrations/supabase/types";
import { UseFormReturn } from "react-hook-form";
import { OfferFormValues } from "./offerSchema";
import ImageUpload from "../shared/ImageUpload";

// Base form section props
interface BaseFormSectionProps {
  form: UseFormReturn<OfferFormValues>;
}

// Props for sections that need discount type
interface DiscountSectionProps extends BaseFormSectionProps {
  discountType: string;
}

// Props for sections that need target type
interface TargetSectionProps extends BaseFormSectionProps {
  targetType: string;
  categories?: Tables<"categories">[];
  products?: Tables<"products">[];
}

export const BasicInfoSection = ({ form }: BaseFormSectionProps) => (
  <>
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
  </>
);

export const ImageSection = ({ form, targetType }: { form: UseFormReturn<OfferFormValues>; targetType: string }) => {
  // Only show image upload for category or all products offers
  if (targetType === "product") {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="offer_image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>صورة العرض</FormLabel>
          <FormControl>
            <ImageUpload
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="ارفع صورة العرض"
            />
          </FormControl>
          <FormMessage />
          <p className="text-xs text-muted-foreground">
            {targetType === "all" 
              ? "اختر صورة لتمثيل هذا العرض على جميع المنتجات" 
              : "اختر صورة لتمثيل هذا العرض للتصنيف"}
          </p>
        </FormItem>
      )}
    />
  );
};

export const DiscountSection = ({ form, discountType }: DiscountSectionProps) => (
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
);

export const TargetSection = ({ form, targetType, categories, products }: TargetSectionProps) => (
  <>
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
                {targetType === "category" && categories
                  ? categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  : products && products.map((product) => (
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
  </>
);

export const DateSection = ({ form }: BaseFormSectionProps) => (
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
);

export const StatusSection = ({ form }: BaseFormSectionProps) => (
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
);
