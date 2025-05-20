
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingCart, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "إجمالي الزوار",
      value: "1,234",
      icon: <Users className="h-6 w-6" />,
      change: "+12%",
      positive: true,
    },
    {
      title: "إجمالي الطلبات",
      value: "64",
      icon: <ShoppingCart className="h-6 w-6" />,
      change: "+8%",
      positive: true,
    },
    {
      title: "إجمالي المبيعات",
      value: "12,345 ر.س",
      icon: <TrendingUp className="h-6 w-6" />,
      change: "+23%",
      positive: true,
    },
    {
      title: "متوسط قيمة الطلب",
      value: "193 ر.س",
      icon: <BarChart3 className="h-6 w-6" />,
      change: "-2%",
      positive: false,
    },
  ];

  const topProducts = [
    { name: "فستان أنيق بتصميم عصري", sales: 24 },
    { name: "حقيبة يد نسائية", sales: 18 },
    { name: "طقم إكسسوارات فاخر", sales: 15 },
    { name: "عطر مميز للنساء", sales: 12 },
    { name: "حذاء كعب عالي", sales: 10 },
  ];

  const recentOrders = [
    { id: "#12345", customer: "سارة أحمد", date: "2025-05-19", status: "مكتمل", amount: "450 ر.س" },
    { id: "#12344", customer: "نورة محمد", date: "2025-05-19", status: "قيد التجهيز", amount: "320 ر.س" },
    { id: "#12343", customer: "ريم خالد", date: "2025-05-18", status: "قيد الشحن", amount: "750 ر.س" },
    { id: "#12342", customer: "جواهر عبدالله", date: "2025-05-18", status: "مكتمل", amount: "195 ر.س" },
    { id: "#12341", customer: "لمى سعود", date: "2025-05-17", status: "مكتمل", amount: "540 ر.س" },
  ];

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
                <li key={index} className="flex items-center justify-between">
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
                      <td className="py-3 text-sm">{order.id}</td>
                      <td className="py-3 text-sm">{order.customer}</td>
                      <td className="py-3 text-sm">{order.date}</td>
                      <td className="py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "مكتمل"
                              ? "bg-green-100 text-green-800"
                              : order.status === "قيد التجهيز"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-medium text-left">{order.amount}</td>
                    </tr>
                  ))}
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
