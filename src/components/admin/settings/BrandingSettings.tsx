
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Upload } from "lucide-react";

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
import { dataService } from "@/services/auth.service";

const brandingSchema = z.object({
  primaryColor: z.string().min(1, { message: "اللون الأساسي مطلوب" }),
  secondaryColor: z.string().min(1, { message: "اللون الثانوي مطلوب" }),
  favicon: z.instanceof(File).optional(),
  logo: z.instanceof(File).optional(),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

const BrandingSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  
  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: "#F48FB1", // Default primary color
      secondaryColor: "#FFD180", // Default secondary color
    },
  });
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await dataService.getStoreSettings();
        if (settings) {
          form.reset({
            primaryColor: settings.primary_color || "#F48FB1",
            secondaryColor: settings.secondary_color || "#FFD180",
          });
          
          if (settings.logo_url) {
            setLogoPreview(settings.logo_url);
          }
          
          if (settings.favicon_url) {
            setFaviconPreview(settings.favicon_url);
          }
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
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      form.setValue("logo", file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFaviconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      form.setValue("favicon", file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (values: BrandingFormValues) => {
    setIsLoading(true);
    
    try {
      // Upload logo if changed
      let logoUrl = logoPreview;
      if (values.logo) {
        const uploadResult = await dataService.uploadStoreImage(values.logo, "logo");
        if (uploadResult.success) {
          logoUrl = uploadResult.url;
        }
      }
      
      // Upload favicon if changed
      let faviconUrl = faviconPreview;
      if (values.favicon) {
        const uploadResult = await dataService.uploadStoreImage(values.favicon, "favicon");
        if (uploadResult.success) {
          faviconUrl = uploadResult.url;
          
          // Update favicon in document
          const faviconLink = document.querySelector("link[rel='icon']");
          if (faviconLink) {
            faviconLink.setAttribute("href", faviconUrl);
          }
        }
      }
      
      // Update branding settings
      await dataService.updateStoreSettings({
        primary_color: values.primaryColor,
        secondary_color: values.secondaryColor,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
      });
      
      // Update CSS variables for colors
      document.documentElement.style.setProperty("--primary", values.primaryColor);
      document.documentElement.style.setProperty("--secondary", values.secondaryColor);
      
      toast.success("تم تحديث إعدادات العلامة التجارية بنجاح");
    } catch (error) {
      console.error("Error updating branding settings:", error);
      toast.error("حدث خطأ أثناء تحديث إعدادات العلامة التجارية");
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
        <CardTitle>العلامة التجارية</CardTitle>
        <CardDescription>
          تحديث العلامة التجارية للمتجر بما في ذلك الشعار والألوان
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">شعار المتجر</h3>
              
              <div className="flex flex-col gap-4">
                {logoPreview && (
                  <div className="border rounded p-4 flex justify-center">
                    <img 
                      src={logoPreview} 
                      alt="شعار المتجر" 
                      className="h-20 object-contain"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    اختر شعاراً جديداً
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    يفضل استخدام صورة PNG بخلفية شفافة
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">أيقونة المتجر (Favicon)</h3>
              
              <div className="flex flex-col gap-4">
                {faviconPreview && (
                  <div className="border rounded p-4 flex justify-center">
                    <img 
                      src={faviconPreview} 
                      alt="أيقونة المتجر" 
                      className="h-10 object-contain"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Input
                    id="favicon-upload"
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFaviconChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("favicon-upload")?.click()}
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    اختر أيقونة جديدة
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    يفضل استخدام صورة PNG مربعة بحجم 32x32 أو 64x64
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ألوان المتجر</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اللون الرئيسي</FormLabel>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 border rounded" 
                          style={{ backgroundColor: field.value }}
                        />
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اللون الثانوي</FormLabel>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 border rounded" 
                          style={{ backgroundColor: field.value }}
                        />
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default BrandingSettings;
