
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import { CartItem, getCart, updateCartItem, removeFromCart, getCartTotal } from "@/utils/cartUtils";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setTotal(getCartTotal());
  }, []);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem(id, quantity);
    setCartItems(getCart());
    setTotal(getCartTotal());
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    setCartItems(getCart());
    setTotal(getCartTotal());
    toast({
      title: "تم الحذف",
      description: "تم حذف المنتج من سلة التسوق",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "الرجاء إضافة منتجات للسلة قبل الشراء",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            الرئيسية
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground">سلة التسوق</span>
        </div>

        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          سلة التسوق
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-muted/50 rounded-lg">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">سلة التسوق فارغة</h2>
            <p className="text-muted-foreground mb-6">
              لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
            </p>
            <Button asChild>
              <Link to="/products">تسوق الآن</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-right py-4 px-6">المنتج</th>
                        <th className="text-right py-4 px-6">السعر</th>
                        <th className="text-right py-4 px-6">الكمية</th>
                        <th className="text-right py-4 px-6">المجموع</th>
                        <th className="text-right py-4 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <div className="mr-4">
                                <Link
                                  to={`/product/${item.id}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {item.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">{item.price} ر.س</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center border rounded-md w-28">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="h-8 w-10 text-center border-0 p-0"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {(item.price * item.quantity).toFixed(2)} ر.س
                          </td>
                          <td className="py-4 px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      المجموع ({cartItems.length} منتج)
                    </span>
                    <span>{total.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span>مجاني</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>المجموع الكلي</span>
                      <span>{total.toFixed(2)} ر.س</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    متابعة الشراء
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/products">مواصلة التسوق</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
