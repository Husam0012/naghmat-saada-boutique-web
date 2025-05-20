
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { dataService } from "@/services/auth.service";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applies_to_category_id: {
    id: string;
    name: string;
  } | null;
  applies_to_product_id: {
    id: string;
    name: string;
  } | null;
}

const SpecialOffersPage = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: dataService.getOffers,
  });

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  // Filter active offers only
  const activeOffers = offers?.filter((offer: Offer) => {
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);
    return offer.is_active && now >= startDate && now <= endDate;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ar-SA", options);
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
          <span className="font-medium text-foreground">العروض الخاصة</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">العروض الخاصة</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            استفد من أفضل العروض والخصومات المتاحة على منتجاتنا لفترة محدودة
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeOffers?.length === 0 ? (
          <div className="text-center py-16 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              لا توجد عروض متاحة حالياً
            </h2>
            <p className="text-muted-foreground mb-6">
              يرجى العودة لاحقاً للاطلاع على العروض الجديدة
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeOffers?.map((offer: Offer) => (
              <Card
                key={offer.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-primary/10 p-1 text-center">
                  <span className="text-sm font-medium">
                    العرض ساري حتى {formatDate(offer.end_date)}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">{offer.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {offer.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    {offer.discount_percentage ? (
                      <Badge className="w-fit text-base px-3 py-1 bg-red-500">
                        خصم {offer.discount_percentage}%
                      </Badge>
                    ) : offer.discount_amount ? (
                      <Badge className="w-fit text-base px-3 py-1 bg-red-500">
                        خصم {offer.discount_amount} ر.س
                      </Badge>
                    ) : null}

                    {offer.applies_to_category_id && (
                      <div className="text-sm font-medium">
                        التصنيف:{" "}
                        <Link
                          to={`/products?category=${offer.applies_to_category_id.id}`}
                          className="text-primary hover:underline"
                        >
                          {offer.applies_to_category_id.name}
                        </Link>
                      </div>
                    )}

                    {offer.applies_to_product_id && (
                      <div className="text-sm font-medium">
                        المنتج:{" "}
                        <Link
                          to={`/product/${offer.applies_to_product_id.id}`}
                          className="text-primary hover:underline"
                        >
                          {offer.applies_to_product_id.name}
                        </Link>
                      </div>
                    )}
                  </div>

                  {offer.applies_to_category_id ? (
                    <Link
                      to={`/products?category=${offer.applies_to_category_id.id}`}
                      className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded transition-colors"
                    >
                      تسوق الآن
                    </Link>
                  ) : offer.applies_to_product_id ? (
                    <Link
                      to={`/product/${offer.applies_to_product_id.id}`}
                      className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded transition-colors"
                    >
                      عرض المنتج
                    </Link>
                  ) : (
                    <Link
                      to="/products"
                      className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded transition-colors"
                    >
                      تسوق الآن
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SpecialOffersPage;
