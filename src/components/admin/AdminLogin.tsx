
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication check
    setTimeout(() => {
      if (username === "Admin" && password === "Admin") {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بك في لوحة تحكم نغمات السعادة",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "فشل تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md shadow-lg border-0 shadow-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <img 
              src="/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png" 
              alt="نغمات السعادة" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-display gradient-text">لوحة التحكم</CardTitle>
          <CardDescription>الرجاء تسجيل الدخول للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <Button variant="link" onClick={() => navigate("/")} className="text-sm text-muted-foreground">
            العودة إلى موقع المتجر
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
