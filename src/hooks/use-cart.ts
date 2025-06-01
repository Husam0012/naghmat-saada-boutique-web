
import { useState, useEffect } from 'react';
import { CartItem, getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartTotal, getCartItemsCount } from '@/utils/cartUtils';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const { toast } = useToast();

  // Load cart data on mount
  useEffect(() => {
    const cartItems = getCart();
    setItems(cartItems);
    setTotal(getCartTotal());
    setItemsCount(getCartItemsCount());
  }, []);

  // Update state after cart operations
  const updateCartState = () => {
    const cartItems = getCart();
    setItems(cartItems);
    setTotal(getCartTotal());
    setItemsCount(getCartItemsCount());
  };

  const addItem = (item: CartItem) => {
    addToCart(item);
    updateCartState();
    toast({
      title: "تم الإضافة",
      description: "تم إضافة المنتج إلى سلة التسوق",
    });
  };

  const updateItem = (id: string, quantity: number) => {
    updateCartItem(id, quantity);
    updateCartState();
  };

  const removeItem = (id: string) => {
    removeFromCart(id);
    updateCartState();
    toast({
      title: "تم الحذف",
      description: "تم حذف المنتج من سلة التسوق",
    });
  };

  const clearAllItems = () => {
    clearCart();
    updateCartState();
    toast({
      title: "تم المسح",
      description: "تم مسح جميع المنتجات من سلة التسوق",
    });
  };

  return {
    items,
    total,
    itemsCount,
    addItem,
    updateItem,
    removeItem,
    clearAllItems,
  };
};
