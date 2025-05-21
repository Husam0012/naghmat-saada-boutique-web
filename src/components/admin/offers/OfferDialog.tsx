
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Offer } from "./OffersManagement";
import { Tables } from "@/integrations/supabase/types";
import { useOfferForm } from "./useOfferForm";
import { 
  BasicInfoSection, 
  DiscountSection,
  TargetSection,
  DateSection,
  StatusSection
} from "./OfferFormSections";

interface OfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  categories: Tables<"categories">[];
  products: Tables<"products">[];
  onSave: (data: any) => void;
}

const OfferDialog = ({
  open,
  onOpenChange,
  offer,
  categories,
  products,
  onSave,
}: OfferDialogProps) => {
  const isEditing = !!offer;
  const { form, onSubmit, discountType, targetType } = useOfferForm({
    open,
    offer,
    onSave,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "تعديل العرض" : "إضافة عرض جديد"}</DialogTitle>
        </DialogHeader>

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
