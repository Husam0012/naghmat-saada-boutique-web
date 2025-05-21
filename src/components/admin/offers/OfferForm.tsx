
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { 
  BasicInfoSection, 
  DiscountSection,
  TargetSection,
  DateSection,
  StatusSection
} from "./OfferFormSections";
import { UseFormReturn } from "react-hook-form";
import { OfferFormValues } from "./offerSchema";
import { Tables } from "@/integrations/supabase/types";

interface OfferFormProps {
  form: UseFormReturn<OfferFormValues>;
  onSubmit: (values: OfferFormValues) => void;
  isEditing: boolean;
  discountType: "percentage" | "amount";
  targetType: "all" | "category" | "product";
  categories: Tables<"categories">[];
  products: Tables<"products">[];
  onCancel: () => void;
}

const OfferForm = ({
  form,
  onSubmit,
  isEditing,
  discountType,
  targetType,
  categories,
  products,
  onCancel
}: OfferFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoSection form={form} />
        <DiscountSection form={form} discountType={discountType} />
        <TargetSection 
          form={form} 
          targetType={targetType} 
          categories={categories} 
          products={products} 
        />
        <DateSection form={form} />
        <StatusSection form={form} />

        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            إلغاء
          </Button>
          <Button type="submit">
            {isEditing ? "تحديث العرض" : "إضافة العرض"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OfferForm;
