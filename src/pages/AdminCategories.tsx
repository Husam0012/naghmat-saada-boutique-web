
import { useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import CategoriesList from "@/components/admin/categories/CategoriesList";

const AdminCategoriesPage = () => {
  return (
    <AdminAuthGuard>
      <DashboardLayout>
        <CategoriesList />
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminCategoriesPage;
