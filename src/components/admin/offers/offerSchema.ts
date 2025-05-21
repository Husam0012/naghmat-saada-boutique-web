
import * as z from "zod";

export const offerSchema = z.object({
  title: z.string().min(1, { message: "العنوان مطلوب" }),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "amount"]),
  discount_value: z.string().min(1, { message: "قيمة الخصم مطلوبة" }),
  target_type: z.enum(["all", "category", "product"]),
  target_id: z.string().optional(),
  start_date: z.string().min(1, { message: "تاريخ البدء مطلوب" }),
  end_date: z.string().min(1, { message: "تاريخ الانتهاء مطلوب" }),
  is_active: z.boolean().default(true),
});

export type OfferFormValues = z.infer<typeof offerSchema>;
