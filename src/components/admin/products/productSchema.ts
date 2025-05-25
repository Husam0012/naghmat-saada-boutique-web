
import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "اسم المنتج يجب أن يكون على الأقل 3 أحرف"),
  price: z.coerce.number().min(0, "السعر يجب أن يكون أكبر من أو يساوي صفر"),
  old_price: z.coerce.number().min(0).optional().nullable(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  in_stock: z.boolean().default(true),
  featured: z.boolean().default(false),
  images: z.string().default(""),
});

export type ProductFormData = z.infer<typeof productSchema>;
