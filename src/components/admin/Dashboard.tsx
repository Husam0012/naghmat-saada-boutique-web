
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { dataService } from "@/services/auth.service";

interface Statistic {
  id: string;
  visitors_count: number;
  orders_count: number;
  revenue: number;
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  sales?: number; // For tracking sales count
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  date: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistic | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsData = await dataService.getStatistics();
        setStatistics(statsData);

        // Fetch products (in a real app, you would aggregate sales data)
        const productsData = await dataService.getProducts();
        
        // For demo, let's assign random sales to products
        const productsWithSales = productsData.map((product: any) => ({
          ...product,
          sales: Math.floor(Math.random() * 30) + 5 // Random sales between 5-35
        })).sort((a: any, b: any) => b.sales - a.sales).slice(0, 5);
        
        setTopProducts(productsWithSales);

        // Fetch recent orders
        const ordersData = await dataService.getOrders();
        setRecentOrders(ordersData.slice(0, 5).map((order: any) => ({
          ...order,
          date: new Date(order.created_at).toISOString().split('T')[0]
        })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "إجمالي الزوار",
      value: statistics?.visitors_count || 0,
      icon: <Users className="h-6 w-6" />,
      change: "+12%",
      positive: true,
    },
    {
      title: "إجمالي الطلبات",
      value: statistics?.orders_count || 0,
      icon: <ShoppingCart className="h-6 w-6" />,
      change: "+8%",
      positive: true,
    },
    {
      title: "إجمالي المبيعات",
      value: `${statistics?.revenue || 0} ر.س`,
      icon: <TrendingUp className="h-6 w-6" />,
      change: "+23%",
      positive: true,
    },
    {
      title: "متوسط قيمة الطلب",
      value: statistics?.orders_count && statistics.revenue 
        ? `${Math.round(statistics.revenue / statistics.orders_count)} ر.س`
        : "0 ر.س",
      icon: <BarChart3 className="h-6 w-6" />,
      change: "-2%",
      positive: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">لوحة المعلومات</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className={`text-sm mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} من الشهر الماضي
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المنتجات الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {topProducts.map((product, index) => (
                <li key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm ml-3">
                      {index + 1}
                    </span>
                    <span>{product.name}</span>
                  </div>
                  <span className="font-medium">{product.sales} مبيعات</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-muted-foreground">
                    <th className="pb-2">رقم الطلب</th>
                    <th className="pb-2">العميل</th>
                    <th className="pb-2">التاريخ</th>
                    <th className="pb-2">الحالة</th>
                    <th className="pb-2 text-left">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border">
                      <td className="py-3 text-sm">{order.order_number}</td>
                      <td className="py-3 text-sm">{order.customer_name}</td>
                      <td className="py-3 text-sm">{order.date}</td>
                      <td className="py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status === "processing" ? "قيد التجهيز" : 
                           order.status === "shipped" ? "تم الشحن" : 
                           order.status === "delivered" ? "تم التسليم" : "ملغي"}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-medium text-left">{order.total_amount} ر.س</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-muted-foreground">
                        لا يوجد طلبات حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
