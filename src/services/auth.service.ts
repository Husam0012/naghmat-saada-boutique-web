import { supabase } from "@/integrations/supabase/client";
import { applyOffersToProducts, applyOffersToProduct, getActiveOffers } from "@/utils/offerUtils";
import bcrypt from 'bcryptjs';

// Admin authentication service using Supabase database
export const adminAuth = {
  // Create default admin user if it doesn't exist
  createDefaultAdmin: async () => {
    try {
      console.log("Checking for default admin user...");
      
      // Check if default admin exists
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id, username')
        .eq('username', 'Admin')
        .single();

      if (existingAdmin) {
        console.log("Default admin user already exists:", existingAdmin);
        
        // Fix password hash issue - update the existing admin with correct password
        console.log("Updating admin password hash...");
        const saltRounds = 10;
        const defaultPassword = 'Admin';
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
        
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ password_hash: hashedPassword })
          .eq('username', 'Admin');
          
        if (updateError) {
          console.error("Error updating admin password:", updateError);
        } else {
          console.log("Admin password hash updated successfully");
        }
        
        return { success: true, message: 'Default admin exists and password updated' };
      }

      console.log("Creating default admin user...");
      
      // Create default admin with username "Admin" and password "Admin"
      const saltRounds = 10;
      const defaultPassword = 'Admin';
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          username: 'Admin',
          password_hash: hashedPassword
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating default admin:", error);
        return { success: false, error: 'فشل في إنشاء المستخدم الافتراضي' };
      }

      console.log("Default admin user created successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error in createDefaultAdmin:", error);
      return { success: false, error: 'حدث خطأ أثناء إنشاء المستخدم الافتراضي' };
    }
  },

  login: async (username: string, password: string) => {
    try {
      console.log("Attempting login for username:", username);
      
      // First, ensure default admin exists and has correct password
      await adminAuth.createDefaultAdmin();
      
      // Get admin user from database
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      console.log("Database query result:", { adminUser, error });

      if (error || !adminUser) {
        console.log("User not found or database error:", error);
        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      console.log("Found admin user:", { id: adminUser.id, username: adminUser.username });
      console.log("Attempting password verification...");
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
      console.log("Password verification result:", isPasswordValid);
      
      if (!isPasswordValid) {
        console.log("Password verification failed");
        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      console.log("Login successful, storing session...");
      
      // Store admin session
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('adminUserId', adminUser.id);
      localStorage.setItem('adminUsername', adminUser.username);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  },

  register: async (username: string, password: string) => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        return { success: false, error: 'اسم المستخدم مستخدم بالفعل' };
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new admin user
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          username: username,
          password_hash: hashedPassword
        }])
        .select()
        .single();

      if (error) {
        console.error("Registration error:", error);
        return { success: false, error: 'فشل في إنشاء الحساب' };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  },

  logout: () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUserId');
    localStorage.removeItem('adminUsername');
    return true;
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  },

  getCurrentAdminId: () => {
    return localStorage.getItem('adminUserId');
  },

  getCurrentAdminUsername: () => {
    return localStorage.getItem('adminUsername');
  },
  
  // Verify current password
  verifyPassword: async (password: string) => {
    try {
      const adminId = adminAuth.getCurrentAdminId();
      if (!adminId) {
        return { success: false, error: 'غير مصرح بالدخول' };
      }

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', adminId)
        .single();

      if (error || !adminUser) {
        return { success: false, error: 'فشل في التحقق من كلمة المرور' };
      }

      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
      return { success: isPasswordValid };
    } catch (error) {
      console.error("Error verifying password:", error);
      return { success: false, error: "خطأ في التحقق من كلمة المرور" };
    }
  },
  
  // Update password
  updatePassword: async (newPassword: string) => {
    try {
      const adminId = adminAuth.getCurrentAdminId();
      if (!adminId) {
        return { success: false, error: 'غير مصرح بالدخول' };
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password in database
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminId);

      if (error) {
        console.error("Error updating password:", error);
        return { success: false, error: "فشل في تحديث كلمة المرور" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      return { success: false, error: "فشل في تحديث كلمة المرور" };
    }
  },

  // Update username
  updateUsername: async (newUsername: string) => {
    try {
      const adminId = adminAuth.getCurrentAdminId();
      if (!adminId) {
        return { success: false, error: 'غير مصرح بالدخول' };
      }

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', newUsername)
        .neq('id', adminId)
        .single();

      if (existingUser) {
        return { success: false, error: 'اسم المستخدم مستخدم بالفعل' };
      }

      // Update username in database
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          username: newUsername,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminId);

      if (error) {
        console.error("Error updating username:", error);
        return { success: false, error: "فشل في تحديث اسم المستخدم" };
      }

      // Update local storage
      localStorage.setItem('adminUsername', newUsername);
      
      return { success: true };
    } catch (error) {
      console.error("Error updating username:", error);
      return { success: false, error: "فشل في تحديث اسم المستخدم" };
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
        store_name: "متجرك ستور",
        contact_email: "info@naghmat-alsaada.com",
        contact_phone: "+967770740731",
        address: "صنعاء-الجمهورية اليمنية",
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
