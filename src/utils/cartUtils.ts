
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Retrieve cart from localStorage
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Add item to cart
export const addToCart = (item: CartItem): CartItem[] => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

// Update item quantity in cart
export const updateCartItem = (id: string, quantity: number): CartItem[] => {
  const cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === id);
  
  if (itemIndex >= 0) {
    cart[itemIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  return cart;
};

// Remove item from cart
export const removeFromCart = (id: string): CartItem[] => {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

// Clear entire cart
export const clearCart = (): CartItem[] => {
  localStorage.removeItem("cart");
  return [];
};

// Get cart total price
export const getCartTotal = (): number => {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
};

// Get cart items count
export const getCartItemsCount = (): number => {
  return getCart().reduce((count, item) => count + item.quantity, 0);
};
