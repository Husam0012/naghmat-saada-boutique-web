import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Package, ChevronRight, Truck, MapPin } from "lucide-react";
import { dataService } from "@/services/auth.service";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const OrderConfirmation = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => dataService.getOrderByNumber(orderNumber || ""),
    enabled: !!orderNumber,
  });

  useEffect(() => {
    if (data) {
      setOrder(data);
    }
  }, [data]);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="border-yellow-200 text-yellow-800 bg-yellow-50">
            قيد التجهيز
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50">
            تم الشحن
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="border-green-200 text-green-800 bg-green-50">
            تم التسليم
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-200 text-red-800 bg-red-50">
            ملغي
          </Badge>
        );
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ar-SA", options);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-8" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">طلب غير موجود</h1>
            <p className="text-muted-foreground mb-6">
              نعتذر، لم نتمكن من العثور على الطلب الذي تبحث عنه.
            </p>
            <Button asChild>
              <Link to="/order-tracking">تتبع طلب آخر</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
          <Link to="/" className="hover:text-primary">
            الرئيسية
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground">تأكيد الطلب</span>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              شكراً لك! تم استلام طلبك بنجاح
            </h1>
            <p className="mt-2 text-muted-foreground">
              سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني {order.customer_email}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle>تفاصيل الطلب</CardTitle>
                <div className="mt-2 md:mt-0">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground ml-2">
                      حالة الطلب:
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <Package className="h-4 w-4 ml-2" />
                    معلومات الطلب
                  </h3>
                  <div className="text-sm">
                    <p className="py-1">
                      <span className="font-medium">رقم الطلب:</span>{" "}
                      {order.order_number}
                    </p>
                    <p className="py-1">
                      <span className="font-medium">تاريخ الطلب:</span>{" "}
                      {formatDate(order.created_at)}
                    </p>
                    <p className="py-1">
                      <span className="font-medium">اسم العميل:</span>{" "}
                      {order.customer_name}
                    </p>
                    <p className="py-1">
                      <span className="font-medium">البريد الإلكتروني:</span>{" "}
                      {order.customer_email}
                    </p>
                    <p className="py-1">
                      <span className="font-medium">رقم الهاتف:</span>{" "}
                      {order.customer_phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <MapPin className="h-4 w-4 ml-2" />
                    عنوان التوصيل
                  </h3>
                  <div className="text-sm">
                    <p className="py-1">{order.customer_name}</p>
                    <p className="py-1">{order.address}</p>
                    <p className="py-1">{order.city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">المنتجات</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-sm">
                        <th className="text-right py-3 px-4">المنتج</th>
                        <th className="text-right py-3 px-4">السعر</th>
                        <th className="text-right py-3 px-4">الكمية</th>
                        <th className="text-right py-3 px-4">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.order_items?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-4 px-4">{item.product_name}</td>
                          <td className="py-4 px-4">{item.price} ر.س</td>
                          <td className="py-4 px-4">{item.quantity}</td>
                          <td className="py-4 px-4">
                            {(item.price * item.quantity).toFixed(2)} ر.س
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/30 border-t">
                        <td
                          colSpan={3}
                          className="text-left py-3 px-4 font-medium"
                        >
                          المجموع
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {order.total_amount.toFixed(2)} ر.س
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Button asChild>
              <Link to="/">العودة للصفحة الرئيسية</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/order-tracking">تتبع طلب آخر</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
