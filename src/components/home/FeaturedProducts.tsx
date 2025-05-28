import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/auth.service";
import { ProductWithOffer } from "@/utils/offerUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  isNew?: boolean;
  isOnSale?: boolean;
  offerTitle?: string | null;
}

const ProductCard = ({ id, name, price, oldPrice, image, isNew, isOnSale, offerTitle }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1
    });
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm group card-hover">
      <div className="relative">
        <Link to={`/product/${id}`}>
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        
        {isNew && !isOnSale && (
          <Badge className="absolute top-3 right-3 bg-primary text-white">جديد</Badge>
        )}
        
        {isOnSale && (
          <Badge variant="outline" className="absolute top-3 right-3 bg-accent text-accent-foreground">
            {offerTitle || "تخفيض"}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-medium mb-2 transition-colors group-hover:text-primary line-clamp-1">{name}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold">{price} ر.س</span>
            {oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{oldPrice} ر.س</span>
            )}
          </div>
          <Button size="icon" className="rounded-full h-9 w-9" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<ProductWithOffer[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<ProductWithOffer[]>([]);
  
  const { data = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const allProducts = await dataService.getProducts();
      return allProducts.filter((product: ProductWithOffer) => product.featured === true);
    },
  });
  
  useEffect(() => {
    if (data.length > 0) {
      setProducts(data);
      updateVisibleProducts(0, data);
    }
  }, [data]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (products.length > 4) {
        const nextIndex = (currentIndex + 1) % (products.length - 3);
        setCurrentIndex(nextIndex);
        updateVisibleProducts(nextIndex, products);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [currentIndex, products]);
  
  const updateVisibleProducts = (startIndex: number, allProducts: ProductWithOffer[]) => {
    const productsToShow = allProducts.slice(startIndex, startIndex + 4);
    setVisibleProducts(productsToShow);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">منتجات مميزة</h2>
            <Link to="/products" className="text-primary hover:text-primary/80 flex items-center">
              <span className="ml-1">عرض الكل</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-sm">
                <div className="aspect-[3/4] bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">منتجات مميزة</h2>
          <Link to="/products" className="text-primary hover:text-primary/80 flex items-center">
            <span className="ml-1">عرض الكل</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {visibleProducts.length > 0 ? visibleProducts.map((product: ProductWithOffer) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              oldPrice={product.old_price}
              image={product.images?.[0] || "/placeholder.svg"}
              isNew={!product.old_price && product.created_at && new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
              isOnSale={!!product.old_price}
              offerTitle={product.applied_offer?.title}
            />
          )) : products.slice(0, 4).map((product: ProductWithOffer) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              oldPrice={product.old_price}
              image={product.images?.[0] || "/placeholder.svg"}
              isNew={!product.old_price && product.created_at && new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
              isOnSale={!!product.old_price}
              offerTitle={product.applied_offer?.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
