
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Offer } from "@/components/admin/offers/OffersManagement";

export type ProductWithOffer = Tables<"products"> & {
  category_id: {
    id: string;
    name: string;
  };
  applied_offer?: Offer | null;
  original_price?: number;
};

/**
 * Check if an offer is currently active based on start and end dates
 */
export const isOfferActive = (offer: Offer): boolean => {
  const now = new Date();
  const startDate = new Date(offer.start_date);
  const endDate = new Date(offer.end_date);
  
  return offer.is_active && startDate <= now && endDate >= now;
};

/**
 * Get all active offers based on current date
 */
export const getActiveOffers = async (): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from("offers")
    .select(`
      *,
      applies_to_category_id(id, name),
      applies_to_product_id(id, name)
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching offers:", error);
    return [];
  }

  const now = new Date();
  return (data as Offer[]).filter(offer => {
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);
    return startDate <= now && endDate >= now;
  });
};

/**
 * Calculate the discounted price based on offer type
 */
export const calculateDiscountedPrice = (
  price: number,
  offer: Offer
): number => {
  if (!isOfferActive(offer)) return price;

  if (offer.discount_percentage) {
    const discountAmount = (price * Number(offer.discount_percentage)) / 100;
    return parseFloat((price - discountAmount).toFixed(2));
  }

  if (offer.discount_amount) {
    const discountedPrice = price - Number(offer.discount_amount);
    return parseFloat(Math.max(0, discountedPrice).toFixed(2));
  }

  return price;
};

/**
 * Apply offers to a product
 */
export const applyOffersToProduct = (
  product: Tables<"products">,
  offers: Offer[]
): ProductWithOffer => {
  // Filter active offers that apply to this product
  const applicableOffers = offers.filter(offer => {
    if (!isOfferActive(offer)) return false;

    // Check if offer applies to all products (no target specified)
    if (!offer.target_type || offer.target_type === "all") return true;

    // Check if offer applies to this product's category
    if (
      offer.target_type === "category" &&
      offer.applies_to_category_id?.id === product.category_id?.id
    ) {
      return true;
    }

    // Check if offer applies directly to this product
    if (
      offer.target_type === "product" &&
      offer.applies_to_product_id?.id === product.id
    ) {
      return true;
    }

    return false;
  });

  // If no applicable offers, return the product as is
  if (applicableOffers.length === 0) {
    return product as ProductWithOffer;
  }

  // Find the best offer (highest discount)
  let bestOffer: Offer | null = null;
  let lowestPrice = product.price;

  for (const offer of applicableOffers) {
    const discountedPrice = calculateDiscountedPrice(product.price, offer);
    if (discountedPrice < lowestPrice) {
      lowestPrice = discountedPrice;
      bestOffer = offer;
    }
  }

  if (bestOffer) {
    return {
      ...product,
      original_price: product.price,
      price: lowestPrice,
      old_price: product.price, // Set old_price to the original price
      applied_offer: bestOffer,
    } as ProductWithOffer;
  }

  return product as ProductWithOffer;
};

/**
 * Apply offers to a list of products
 */
export const applyOffersToProducts = (
  products: Tables<"products">[],
  offers: Offer[]
): ProductWithOffer[] => {
  // Filter out inactive offers
  const activeOffers = offers.filter(isOfferActive);
  
  // If no active offers, return products as is
  if (activeOffers.length === 0) {
    return products as ProductWithOffer[];
  }

  // Apply offers to each product
  return products.map(product => applyOffersToProduct(product, activeOffers));
};
