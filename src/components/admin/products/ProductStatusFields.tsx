
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface ProductStatusFieldsProps {
  form: UseFormReturn<any>;
}

const ProductStatusFields = ({ form }: ProductStatusFieldsProps) => {
  return (
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
  );
};

export default ProductStatusFields;
