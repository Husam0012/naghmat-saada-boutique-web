
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import ImageUpload from "../shared/ImageUpload";

interface ProductImageFieldProps {
  form: UseFormReturn<any>;
}

const ProductImageField = ({ form }: ProductImageFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <ImageUpload
              label="صور المنتج"
              value={field.value}
              onChange={field.onChange}
              multiple={true}
              maxFiles={5}
            />
          </FormControl>
          <FormDescription>
            يمكنك رفع حتى 5 صور للمنتج
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductImageField;
