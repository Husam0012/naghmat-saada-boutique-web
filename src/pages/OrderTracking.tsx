
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  orderNumber: z.string().min(1, {
    message: "يرجى إدخال رقم الطلب",
  }),
});

const OrderTracking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Navigate to the order confirmation page to view the order details
      navigate(`/order-confirmation/${values.orderNumber}`);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "لم نتمكن من العثور على الطلب، يرجى التحقق من رقم الطلب",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">تتبع طلبك</CardTitle>
              <CardDescription>أدخل رقم الطلب لتتبع حالته</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الطلب</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 123456" {...field} />
                        </FormControl>
                        <FormDescription>
                          يمكنك العثور على رقم الطلب في بريدك الإلكتروني الذي استلمته بعد تقديم الطلب.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "جاري البحث..."
                    ) : (
                      <>
                        <Search className="ml-2 h-4 w-4" />
                        تتبع الطلب
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
