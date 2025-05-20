
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/auth.service";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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

interface Category {
  id: string;
  name: string;
}

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortOption, setSortOption] = useState<string>("newest");

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: dataService.getProducts,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: dataService.getCategories,
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    if (productsData) {
      // Find the highest price for the slider
      const highestPrice = Math.max(
        ...productsData.map((product: Product) => product.price)
      );
      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
    }
  }, [productsData]);

  useEffect(() => {
    if (productsData) {
      let filtered = [...productsData];

      // Apply category filter
      if (selectedCategory) {
        filtered = filtered.filter(
          (product: Product) => product.category_id?.id === selectedCategory
        );
      }

      // Apply price range filter
      filtered = filtered.filter(
        (product: Product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Apply sorting
      switch (sortOption) {
        case "price-asc":
          filtered.sort((a: Product, b: Product) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a: Product, b: Product) => b.price - a.price);
          break;
        case "name-asc":
          filtered.sort((a: Product, b: Product) =>
            a.name.localeCompare(b.name)
          );
          break;
        case "name-desc":
          filtered.sort((a: Product, b: Product) =>
            b.name.localeCompare(a.name)
          );
          break;
        case "newest":
        default:
          // Assuming products are already sorted by newest first in the API response
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [productsData, selectedCategory, priceRange, sortOption]);

  const formatPrice = (price: number) => {
    return `${price} ر.س`;
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? null : value);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-center mb-12">المنتجات</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-12">المنتجات</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <h2 className="text-xl font-semibold mb-4">تصفية المنتجات</h2>

              {/* Category filter */}
              <div className="space-y-2">
                <label className="font-medium block mb-2">التصنيف</label>
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="جميع التصنيفات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    {categoriesData?.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range filter */}
              <div className="space-y-2">
                <label className="font-medium block mb-4">السعر</label>
                <div className="pt-6 pb-2">
                  <Slider 
                    defaultValue={[0, maxPrice]} 
                    max={maxPrice} 
                    step={10} 
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceChange}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Sort options */}
              <div className="space-y-2">
                <label className="font-medium block mb-2">الترتيب</label>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="الترتيب الافتراضي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-asc">السعر: من الأقل إلى الأعلى</SelectItem>
                    <SelectItem value="price-desc">السعر: من الأعلى إلى الأقل</SelectItem>
                    <SelectItem value="name-asc">الاسم: أ-ي</SelectItem>
                    <SelectItem value="name-desc">الاسم: ي-أ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">لا توجد منتجات متطابقة مع معايير البحث</h3>
                <p className="text-muted-foreground mt-2">يرجى تجربة معايير تصفية مختلفة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: Product) => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.old_price && (
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            خصم
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <h3 className="font-medium line-clamp-2">{product.name}</h3>
                        <div className="mt-auto pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="font-bold text-lg">
                                {formatPrice(product.price)}
                              </span>
                              {product.old_price && (
                                <span className="text-muted-foreground line-through text-sm">
                                  {formatPrice(product.old_price)}
                                </span>
                              )}
                            </div>
                            {!product.in_stock && (
                              <Badge variant="outline" className="text-red-500 border-red-200">
                                نفذت الكمية
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
