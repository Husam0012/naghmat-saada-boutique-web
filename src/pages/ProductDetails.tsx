
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/auth.service";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight, Check, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/utils/cartUtils";
import { ProductWithOffer } from "@/utils/offerUtils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  images: string[] | null;
  category_id: {
    id: string;
    name: string;
  };
  in_stock: boolean;
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fix the query to handle possible undefined id
  const productId = id || '';
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => dataService.getProductById(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAddingToCart(true);
    // Simulate adding to cart with a slight delay
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.svg",
        quantity,
      });

      setIsAddingToCart(false);
      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة ${product.name} إلى سلة التسوق`,
        action: (
          <Link to="/cart">
            <Button size="sm" variant="outline">
              عرض السلة
            </Button>
          </Link>
        ),
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
          <p className="mt-4 text-muted-foreground">
            يبدو أن المنتج الذي تبحث عنه غير موجود أو تم حذفه.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">العودة إلى المنتجات</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:underline">
            الرئيسية
          </Link>
          <ArrowRight className="mx-2 h-4 w-4 rotate-180" />
          <Link to="/products" className="hover:underline">
            المنتجات
          </Link>
          {product.category_id && (
            <>
              <ArrowRight className="mx-2 h-4 w-4 rotate-180" />
              <Link
                to={`/products?category=${product.category_id.id}`}
                className="hover:underline"
              >
                {product.category_id.name}
              </Link>
            </>
          )}
          <ArrowRight className="mx-2 h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg border overflow-hidden cursor-pointer hover:border-primary ${
                      currentImage === image ? "border-primary border-2" : ""
                    }`}
                    onClick={() => setCurrentImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {/* Category */}
            {product.category_id && (
              <Link 
                to={`/products?category=${product.category_id.id}`} 
                className="inline-block mt-2 text-sm text-muted-foreground hover:text-primary"
              >
                {product.category_id.name}
              </Link>
            )}
            
            {/* Price */}
            <div className="flex items-center mt-4">
              <span className="text-3xl font-bold text-primary">
                {product.price} ر.س
              </span>
              {product.old_price && (
                <>
                  <span className="text-muted-foreground line-through text-xl mr-2">
                    {product.old_price} ر.س
                  </span>
                  <Badge className="mr-2 bg-red-500">خصم {discount}%</Badge>
                </>
              )}
            </div>
            
            {/* Offer Information */}
            {(product as ProductWithOffer).applied_offer && (
              <div className="mt-2 flex items-center text-green-600">
                <Tag className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {(product as ProductWithOffer).applied_offer?.title} - ينتهي في {new Date((product as ProductWithOffer).applied_offer?.end_date || "").toLocaleDateString('ar-SA')}
                </span>
              </div>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center mt-4">
              {product.in_stock ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span>متوفر في المخزون</span>
                </div>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-200">
                  غير متوفر حالياً
                </Badge>
              )}
            </div>

            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">الوصف</TabsTrigger>
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-4">
                <div 
                  className="prose max-w-none rich-text-content"
                  dangerouslySetInnerHTML={{ 
                    __html: product.description || "لا يوجد وصف لهذا المنتج." 
                  }}
                />
              </TabsContent>
              <TabsContent value="details" className="py-4">
                <Card className="border-0 shadow-none">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">المنتج</td>
                        <td className="py-2">{product.name}</td>
                      </tr>
                      {product.category_id && (
                        <tr className="border-b">
                          <td className="py-2 font-medium">التصنيف</td>
                          <td className="py-2">{product.category_id.name}</td>
                        </tr>
                      )}
                      <tr className="border-b">
                        <td className="py-2 font-medium">الحالة</td>
                        <td className="py-2">
                          {product.in_stock ? "متوفر" : "غير متوفر"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Add to cart */}
            <div className="mt-8 flex items-center">
              <div className="border rounded-md flex items-center mr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1 || !product.in_stock}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.in_stock}
                >
                  +
                </Button>
              </div>
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock || isAddingToCart}
              >
                {isAddingToCart ? (
                  "جاري الإضافة..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-4" />
                    إضافة إلى السلة
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
