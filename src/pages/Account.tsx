
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Heart, Settings } from "lucide-react";

const AccountPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-12">حسابي</h1>
        
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle>مرحباً بك</CardTitle>
              <p className="text-muted-foreground">يرجى تسجيل الدخول للوصول إلى حسابك</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                تسجيل الدخول
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                إنشاء حساب جديد
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium mb-2">طلباتي</h3>
                <p className="text-sm text-muted-foreground">تتبع طلباتك وحالة التسليم</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium mb-2">المفضلة</h3>
                <p className="text-sm text-muted-foreground">المنتجات المحفوظة لديك</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium mb-2">الإعدادات</h3>
                <p className="text-sm text-muted-foreground">إدارة معلومات الحساب</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
