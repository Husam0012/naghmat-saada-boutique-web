
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import DashboardLayout from "@/components/admin/DashboardLayout";
import OrdersManagement from "@/components/admin/orders/OrdersManagement";

const AdminOrdersPage = () => {
  return (
    <AdminAuthGuard>
      <DashboardLayout>
        <OrdersManagement />
      </DashboardLayout>
    </AdminAuthGuard>
  );
};

export default AdminOrdersPage;
