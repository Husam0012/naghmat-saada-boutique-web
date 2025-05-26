
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { dataService } from "@/services/auth.service";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductWithOffer } from "@/utils/offerUtils";

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductWithOffer[]>([]);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: dataService.getProducts,
  });

  useEffect(() => {
    if (!searchTerm.trim() || !products) {
      setFilteredProducts([]);
      return;
    }

    // Fuzzy search implementation
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const filtered = products.filter((product: ProductWithOffer) => {
      const productName = product.name.toLowerCase();
      const productDescription = (product.description || "").toLowerCase();
      
      return searchWords.some(word => 
        productName.includes(word) || 
        productDescription.includes(word) ||
        // Check for partial matches
        productName.split(/\s+/).some(nameWord => 
          nameWord.includes(word) || word.includes(nameWord)
        )
      );
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductClick = () => {
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center space-x-2 space-x-reverse pb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            autoFocus
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {searchTerm && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد منتجات تطابق بحثك
            </div>
          )}
          
          {filteredProducts.length > 0 && (
            <div className="space-y-2">
              {filteredProducts.slice(0, 10).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={handleProductClick}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <div className="flex items-center space-x-2 space-x-reverse mt-1">
                            <span className="font-bold text-primary">
                              {product.price} ر.س
                            </span>
                            {product.old_price && (
                              <span className="text-muted-foreground line-through text-sm">
                                {product.old_price} ر.س
                              </span>
                            )}
                            {!product.in_stock && (
                              <Badge variant="outline" className="text-red-500 border-red-200 text-xs">
                                نفذت الكمية
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {filteredProducts.length > 10 && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  عرض {filteredProducts.length > 10 ? '10' : filteredProducts.length} من {filteredProducts.length} نتيجة
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
