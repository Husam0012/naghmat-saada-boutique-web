
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ProductBasicFieldsProps {
  form: UseFormReturn<any>;
}

const ProductBasicFields = ({ form }: ProductBasicFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default ProductBasicFields;
