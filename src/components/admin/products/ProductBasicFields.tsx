
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

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

      <ProductDescriptionEditor form={form} />
    </>
  );
};

export default ProductBasicFields;
