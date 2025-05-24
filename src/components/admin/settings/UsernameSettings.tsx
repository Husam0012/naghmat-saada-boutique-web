
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminAuth } from "@/services/auth.service";

const usernameSchema = z.object({
  currentPassword: z.string().min(1, { message: "كلمة المرور الحالية مطلوبة للتحقق" }),
  newUsername: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

const UsernameSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentUsername = adminAuth.getCurrentAdminUsername();
  
  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      currentPassword: "",
      newUsername: currentUsername || "",
    },
  });
  
  const onSubmit = async (values: UsernameFormValues) => {
    setIsLoading(true);
    
    try {
      // Verify current password first
      const result = await adminAuth.verifyPassword(values.currentPassword);
      
      if (!result.success) {
        toast.error("كلمة المرور الحالية غير صحيحة");
        setIsLoading(false);
        return;
      }
      
      // Update username
      const updateResult = await adminAuth.updateUsername(values.newUsername);
      
      if (updateResult.success) {
        toast.success("تم تغيير اسم المستخدم بنجاح");
        form.setValue('currentPassword', '');
      } else {
        toast.error(updateResult.error || "حدث خطأ أثناء تغيير اسم المستخدم");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("حدث خطأ أثناء تغيير اسم المستخدم");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>تغيير اسم المستخدم</CardTitle>
        <CardDescription>
          قم بتغيير اسم المستخدم الخاص بك للوصول إلى لوحة التحكم
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الحالية</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="أدخل كلمة المرور الحالية للتحقق" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستخدم الجديد</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المستخدم الجديد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري المعالجة..." : "تحديث اسم المستخدم"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UsernameSettings;
