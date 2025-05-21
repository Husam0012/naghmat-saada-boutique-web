
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import DashboardLayout from "@/components/admin/DashboardLayout";
import OffersManagement from "@/components/admin/offers/OffersManagement";

const AdminSpecialOffersPage = () => {
  return (
    <AdminAuthGuard>
      <DashboardLayout>
        <OffersManagement />
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminSpecialOffersPage;
