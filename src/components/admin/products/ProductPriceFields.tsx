
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ProductPriceFieldsProps {
  form: UseFormReturn<any>;
}

const ProductPriceFields = ({ form }: ProductPriceFieldsProps) => {
  return (
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
  );
};

export default ProductPriceFields;
