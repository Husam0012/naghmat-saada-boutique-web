
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "./OrdersTable";
import { OrderStatusDialog } from "./OrderStatusDialog";
import { Tables } from "@/integrations/supabase/types";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export type Order = Tables<"orders"> & {
  order_items: Tables<"order_items">[];
};

const OrdersManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      // Get all orders with their items
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return ordersData as Order[];
    },
  });

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return false;
    }

    await refetch();
    return true;
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>إدارة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>خطأ</AlertTitle>
        <AlertDescription>
          حدث خطأ أثناء تحميل الطلبات. يرجى تحديث الصفحة والمحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders || []} onUpdateStatus={handleStatusUpdate} />
        </CardContent>
      </Card>

      <OrderStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={selectedOrder}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  );
};

export default OrdersManagement;
