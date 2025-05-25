import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCart, getCartTotal, clearCart, CartItem } from "@/utils/cartUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل مطلوب" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" }),
  address: z.string().min(10, { message: "العنوان مطلوب" }),
  city: z.string().min(2, { message: "المدينة مطلوبة" }),
  paymentMethod: z.enum(["cash", "bank_transfer"], {
    required_error: "يرجى اختيار طريقة الدفع",
  }),
});

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    setCartItems(items);
    setTotal(getCartTotal());
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      paymentMethod: "cash",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (cartItems.length === 0) {
      toast({
        title: "سلة التسوق فارغة",
        description: "لا يمكن إكمال عملية الشراء بدون منتجات",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a random order number (digits only, no ORD- prefix)
      const orderNumber = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");

      // Calculate total amount
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create the order in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: values.fullName,
          customer_email: values.email,
          customer_phone: values.phone,
          address: values.address,
          city: values.city,
          total_amount: totalAmount,
          status: "processing",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update statistics
      const today = new Date().toISOString().split("T")[0];
      const { data: stats, error: statsError } = await supabase
        .from("statistics")
        .select("*")
        .eq("date", today);

      if (statsError) throw statsError;

      if (stats && stats.length > 0) {
        // Update existing stats
        await supabase
          .from("statistics")
          .update({
            orders_count: (stats[0].orders_count || 0) + 1,
            revenue: (stats[0].revenue || 0) + totalAmount,
          })
          .eq("id", stats[0].id);
      } else {
        // Create new stats
        await supabase.from("statistics").insert({
          date: today,
          orders_count: 1,
          revenue: totalAmount,
          visitors_count: 1,
        });
      }

      // Clear the cart
      clearCart();

      // Show success toast
      toast({
        title: "تم تقديم الطلب بنجاح",
        description: `رقم الطلب الخاص بك هو ${orderNumber}`,
      });

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من معالجة طلبك، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">إتمام الشراء</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">معلومات الطلب</h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسمك الكامل" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="05xxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوانك بالتفصيل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة</FormLabel>
                        <FormControl>
                          <Input placeholder="المدينة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>طريقة الدفع</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="cash" id="cash" />
                              <Label htmlFor="cash">الدفع عند الاستلام</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem
                                value="bank_transfer"
                                id="bank_transfer"
                              />
                              <Label htmlFor="bank_transfer">
                                تحويل بنكي
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "جاري معالجة الطلب..." : "تأكيد الطلب"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>
              <div className="space-y-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex">
                      <span className="text-muted-foreground">
                        {item.quantity} x
                      </span>
                      <span className="mr-2 truncate max-w-[150px]">
                        {item.name}
                      </span>
                    </div>
                    <span>
                      {(item.price * item.quantity).toFixed(2)} ر.س
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع</span>
                  <span>{total.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>مجاني</span>
                </div>
                <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                  <span>الإجمالي</span>
                  <span>{total.toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
