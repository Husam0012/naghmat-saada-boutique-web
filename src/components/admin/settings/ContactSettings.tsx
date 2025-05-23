
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/services/auth.service";

const contactSchema = z.object({
  storeName: z.string().min(1, { message: "اسم المتجر مطلوب" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  phone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
  address: z.string().min(1, { message: "العنوان مطلوب" }),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      storeName: "",
      email: "",
      phone: "",
      address: "",
      instagram: "",
      facebook: "",
      twitter: "",
    },
  });
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await dataService.getStoreSettings();
        if (settings) {
          form.reset({
            storeName: settings.store_name || "",
            email: settings.contact_email || "",
            phone: settings.contact_phone || "",
            address: settings.address || "",
            instagram: settings.social_instagram || "",
            facebook: settings.social_facebook || "",
            twitter: settings.social_twitter || "",
          });
        }
      } catch (error) {
        console.error("Error loading store settings:", error);
        toast.error("تعذر تحميل إعدادات المتجر");
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadSettings();
  }, [form]);
  
  const onSubmit = async (values: ContactFormValues) => {
    setIsLoading(true);
    
    try {
      await dataService.updateStoreSettings({
        store_name: values.storeName,
        contact_email: values.email,
        contact_phone: values.phone,
        address: values.address,
        social_instagram: values.instagram,
        social_facebook: values.facebook,
        social_twitter: values.twitter,
      });
      
      toast.success("تم تحديث معلومات المتجر بنجاح");
    } catch (error) {
      console.error("Error updating store settings:", error);
      toast.error("حدث خطأ أثناء تحديث معلومات المتجر");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isInitialLoading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الاتصال</CardTitle>
        <CardDescription>
          تحديث معلومات الاتصال والمتجر التي تظهر على الموقع
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المتجر</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المتجر" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="البريد الإلكتروني للمتجر" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="رقم هاتف المتجر" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Textarea placeholder="عنوان المتجر" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="text-lg font-semibold my-4">روابط التواصل الاجتماعي</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="رابط Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="رابط Facebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="رابط Twitter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactSettings;
