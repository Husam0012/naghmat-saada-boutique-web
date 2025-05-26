
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import IndexPage from "./pages/Index";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import CategoriesPage from "./pages/Categories";
import ProductsPage from "./pages/Products";
import ProductDetailsPage from "./pages/ProductDetails";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmation";
import OrderTrackingPage from "./pages/OrderTracking";
import SpecialOffersPage from "./pages/SpecialOffers";
import AccountPage from "./pages/Account";
import AdminLoginPage from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminCategoriesPage from "./pages/AdminCategories";
import AdminProductsPage from "./pages/AdminProducts";
import AdminOrdersPage from "./pages/AdminOrders";
import AdminSpecialOffersPage from "./pages/AdminSpecialOffers";
import AdminSettingsPage from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";
import AdminAuthGuard from "./components/admin/AdminAuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/special-offers" element={<SpecialOffersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={
            <AdminAuthGuard>
              <AdminDashboardPage />
            </AdminAuthGuard>
          } />
          <Route path="/admin/categories" element={
            <AdminAuthGuard>
              <AdminCategoriesPage />
            </AdminAuthGuard>
          } />
          <Route path="/admin/products" element={
            <AdminAuthGuard>
              <AdminProductsPage />
            </AdminAuthGuard>
          } />
          <Route path="/admin/orders" element={
            <AdminAuthGuard>
              <AdminOrdersPage />
            </AdminAuthGuard>
          } />
          <Route path="/admin/special-offers" element={
            <AdminAuthGuard>
              <AdminSpecialOffersPage />
            </AdminAuthGuard>
          } />
          <Route path="/admin/settings" element={
            <AdminAuthGuard>
              <AdminSettingsPage />
            </AdminAuthGuard>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
