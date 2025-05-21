
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Offer } from "./OffersManagement";
import { offerSchema, OfferFormValues } from "./offerSchema";
import { Tables } from "@/integrations/supabase/types";

interface UseOfferFormProps {
  open: boolean;
  offer: Offer | null;
  onSave: (data: any) => void;
}

export const useOfferForm = ({ open, offer, onSave }: UseOfferFormProps) => {
  // Calculate initial values
  const getInitialValues = () => {
    let initialDiscountType = "percentage";
    let initialDiscountValue = "";
    let initialTargetType = "all";
    let initialTargetId = "";

    if (offer) {
      initialDiscountType = offer.discount_percentage ? "percentage" : "amount";
      initialDiscountValue = offer.discount_percentage
        ? String(offer.discount_percentage)
        : offer.discount_amount
        ? String(offer.discount_amount)
        : "";
      
      if (offer.applies_to_category_id) {
        initialTargetType = "category";
        initialTargetId = offer.applies_to_category_id.id;
      } else if (offer.applies_to_product_id) {
        initialTargetType = "product";
        initialTargetId = offer.applies_to_product_id.id;
      } else {
        initialTargetType = "all";
      }
    }

    return {
      title: offer?.title || "",
      description: offer?.description || "",
      discount_type: initialDiscountType as "percentage" | "amount",
      discount_value: initialDiscountValue,
      target_type: initialTargetType as "all" | "category" | "product",
      target_id: initialTargetId,
      start_date: offer?.start_date
        ? new Date(offer.start_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      end_date: offer?.end_date
        ? new Date(offer.end_date).toISOString().split("T")[0]
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      is_active: offer?.is_active !== false,
    };
  };

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: getInitialValues(),
  });

  // Reset form when dialog opens/closes or when offer changes
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

  // Form submission handler
  const onSubmit = (values: OfferFormValues) => {
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

  return {
    form,
    onSubmit,
    discountType: form.watch("discount_type"),
    targetType: form.watch("target_type"),
  };
};
