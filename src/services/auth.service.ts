import { supabase } from "@/integrations/supabase/client";
import { applyOffersToProducts, applyOffersToProduct, getActiveOffers } from "@/utils/offerUtils";

// Simple admin authentication service with hardcoded credentials
// In a production environment, you would use Supabase Auth or another secure solution
export const adminAuth = {
  login: async (username: string, password: string) => {
    // For demo purposes only - in production this would use proper authentication
    if (username === 'Admin' && password === 'Admin') {
      // Store admin session in local storage
      localStorage.setItem('isAdminAuthenticated', 'true');
      return { success: true };
    }
    return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  },

  logout: () => {
    localStorage.removeItem('isAdminAuthenticated');
    return true;
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  },
  
  // Verify current password
  verifyPassword: async (password: string) => {
    // In a real app, this would verify against a secure storage
    return { success: password === 'Admin' };
  },
  
  // Update password
  updatePassword: async (newPassword: string) => {
    try {
      // In a real app, this would securely update the password
      localStorage.setItem('adminPassword', newPassword);
      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      return { success: false, error: "Failed to update password" };
    }
  }
};

// Service for fetching and updating data from Supabase
export const dataService = {
  // Categories
  getCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  },
  
  getCategoryById: async (id: string) => {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  createCategory: async (category: any) => {
    const { data, error } = await supabase.from('categories').insert([category]).select();
    if (error) throw error;
    return data;
  },
  
  updateCategory: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  
  deleteCategory: async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  // Products
  getProducts: async () => {
    try {
      const [productsResponse, offersResponse] = await Promise.all([
        supabase.from('products').select('*, category_id(id, name)'),
        getActiveOffers()
      ]);
      
      if (productsResponse.error) throw productsResponse.error;
      
      // Apply any active offers to the products
      const productsWithOffers = applyOffersToProducts(productsResponse.data, offersResponse);
      return productsWithOffers;
    } catch (error) {
      console.error("Error fetching products with offers:", error);
      throw error;
    }
  },
  
  getProductById: async (id: string) => {
    try {
      const [productResponse, offersResponse] = await Promise.all([
        supabase.from('products').select('*, category_id(id, name)').eq('id', id).single(),
        getActiveOffers()
      ]);
      
      if (productResponse.error) throw productResponse.error;
      
      // Apply any active offers to the product
      const productWithOffers = applyOffersToProduct(productResponse.data, offersResponse);
      return productWithOffers;
    } catch (error) {
      console.error("Error fetching product with offers:", error);
      throw error;
    }
  },
  
  createProduct: async (product: any) => {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (error) throw error;
    return data;
  },
  
  updateProduct: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  
  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  // Orders
  getOrders: async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  getOrderById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          product_id,
          product_name,
          quantity,
          price
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  getOrderByNumber: async (orderNumber: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          product_id,
          product_name,
          quantity,
          price
        )
      `)
      .eq('order_number', orderNumber)
      .single();
    if (error) throw error;
    return data;
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  },
  
  // Special offers
  getOffers: async () => {
    const { data, error } = await supabase.from('offers').select(`
      *,
      applies_to_category_id(id, name),
      applies_to_product_id(id, name)
    `);
    if (error) throw error;
    return data;
  },
  
  getOfferById: async (id: string) => {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        applies_to_category_id(id, name),
        applies_to_product_id(id, name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  createOffer: async (offer: any) => {
    const { data, error } = await supabase.from('offers').insert([offer]).select();
    if (error) throw error;
    return data;
  },
  
  updateOffer: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('offers').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  
  deleteOffer: async (id: string) => {
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  // Statistics
  getStatistics: async () => {
    const { data, error } = await supabase.from('statistics').select('*').order('date', { ascending: false }).limit(1);
    if (error) throw error;
    return data[0] || null;
  },
  
  updateStatistics: async (updates: any) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if a record for today exists
    const { data: existingData } = await supabase
      .from('statistics')
      .select('*')
      .eq('date', today)
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('statistics')
        .update(updates)
        .eq('id', existingData[0].id)
        .select();
      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('statistics')
        .insert([{ ...updates, date: today }])
        .select();
      if (error) throw error;
      return data;
    }
  },
  
  incrementVisitorsCount: async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if a record for today exists
    const { data: existingData } = await supabase
      .from('statistics')
      .select('*')
      .eq('date', today)
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      const { data, error } = await supabase
        .from('statistics')
        .update({ 
          visitors_count: (existingData[0].visitors_count || 0) + 1 
        })
        .eq('id', existingData[0].id)
        .select();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('statistics')
        .insert([{ 
          visitors_count: 1,
          date: today 
        }])
        .select();
      if (error) throw error;
      return data;
    }
  },
  
  // Store Settings
  getStoreSettings: async () => {
    try {
      // In a real app, this would fetch from a settings table in Supabase
      // For demo purposes, we'll use localStorage
      const settingsStr = localStorage.getItem('storeSettings');
      if (settingsStr) {
        return JSON.parse(settingsStr);
      }
      
      // Default settings
      return {
        store_name: "نغمات السعادة",
        contact_email: "info@naghmat-alsaada.com",
        contact_phone: "967770740731+",
        address: "حي الملقا، الرياض\nالمملكة العربية السعودية",
        social_instagram: "",
        social_facebook: "",
        social_twitter: "",
        primary_color: "#F48FB1",
        secondary_color: "#FFD180",
        logo_url: "/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png",
        favicon_url: "/favicon.ico"
      };
    } catch (error) {
      console.error("Error fetching store settings:", error);
      throw error;
    }
  },
  
  updateStoreSettings: async (settings: any) => {
    try {
      // In a real app, this would update a settings table in Supabase
      // For demo purposes, we'll use localStorage
      
      // Get current settings
      const currentSettingsStr = localStorage.getItem('storeSettings');
      const currentSettings = currentSettingsStr ? JSON.parse(currentSettingsStr) : {};
      
      // Merge with new settings
      const updatedSettings = { ...currentSettings, ...settings };
      
      // Save to localStorage
      localStorage.setItem('storeSettings', JSON.stringify(updatedSettings));
      
      return { success: true };
    } catch (error) {
      console.error("Error updating store settings:", error);
      throw error;
    }
  },
  
  // Upload store images (logo, favicon)
  uploadStoreImage: async (file: File, type: 'logo' | 'favicon') => {
    try {
      // In a real app with Supabase, this would upload to storage bucket
      // For demo purposes, we'll use a URL.createObjectURL and localStorage
      
      const fileUrl = URL.createObjectURL(file);
      
      // In a real app, here we would upload to Supabase storage
      // const { data, error } = await supabase.storage
      //  .from('store-assets')
      //  .upload(`${type}/${file.name}`, file);
      
      return {
        success: true,
        url: fileUrl
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
};
