
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Offer } from "./OffersManagement";
import { Tables } from "@/integrations/supabase/types";
import { useOfferForm } from "./useOfferForm";
import OfferForm from "./OfferForm";

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

        <OfferForm 
          form={form}
          onSubmit={onSubmit}
          isEditing={isEditing}
          discountType={discountType}
          targetType={targetType}
          categories={categories}
          products={products}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OfferDialog;
