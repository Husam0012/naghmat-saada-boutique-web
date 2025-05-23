
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

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "كلمة المرور الحالية مطلوبة" }),
  newPassword: z.string().min(6, { message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const PasswordSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Verify current password
      const result = await adminAuth.verifyPassword(values.currentPassword);
      
      if (!result.success) {
        toast.error("كلمة المرور الحالية غير صحيحة");
        setIsLoading(false);
        return;
      }
      
      // Update password
      const updateResult = await adminAuth.updatePassword(values.newPassword);
      
      if (updateResult.success) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        form.reset();
      } else {
        toast.error(updateResult.error || "حدث خطأ أثناء تغيير كلمة المرور");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>تغيير كلمة المرور</CardTitle>
        <CardDescription>
          قم بتغيير كلمة المرور الخاصة بك للوصول إلى لوحة التحكم
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
                    <Input type="password" placeholder="أدخل كلمة المرور الحالية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="أدخل كلمة المرور الجديدة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="أعد إدخال كلمة المرور الجديدة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري المعالجة..." : "تحديث كلمة المرور"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordSettings;
