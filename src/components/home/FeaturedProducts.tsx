
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

const ProductCard = ({ id, name, price, oldPrice, image, isNew, isOnSale }: ProductProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="overflow-hidden border-none shadow-sm group card-hover">
      <div className="relative">
        <Link to={`/products/${id}`}>
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
        
        {isNew && (
          <Badge className="absolute top-3 right-3 bg-primary text-white">جديد</Badge>
        )}
        
        {isOnSale && (
          <Badge variant="outline" className="absolute top-3 right-3 bg-accent text-accent-foreground">تخفيض</Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="text-lg font-medium mb-2 transition-colors group-hover:text-primary line-clamp-1">{name}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold">{price} ر.س</span>
            {oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{oldPrice} ر.س</span>
            )}
          </div>
          <Button size="icon" className="rounded-full h-9 w-9">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedProducts = () => {
  const products: ProductProps[] = [
    {
      id: 1,
      name: "فستان أنيق بتصميم عصري",
      price: 299,
      oldPrice: 399,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000",
      isOnSale: true,
    },
    {
      id: 2,
      name: "حقيبة يد نسائية",
      price: 199,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1000",
      isNew: true,
    },
    {
      id: 3,
      name: "طقم إكسسوارات فاخر",
      price: 149,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 4,
      name: "عطر مميز للنساء",
      price: 349,
      oldPrice: 399,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=1000",
      isOnSale: true,
    },
  ];

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
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
