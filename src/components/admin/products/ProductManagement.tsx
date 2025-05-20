
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProductsTable from "./ProductsTable";
import ProductDialog from "./ProductDialog";
import { dataService } from "@/services/auth.service";

const ProductManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: dataService.getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: dataService.getCategories,
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await dataService.deleteProduct(productId);
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المنتج بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المنتج",
      });
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (selectedProduct) {
        await dataService.updateProduct(selectedProduct.id, productData);
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنتج بنجاح",
        });
      } else {
        await dataService.createProduct(productData);
        toast({
          title: "تم الإضافة بنجاح",
          description: "تم إضافة المنتج بنجاح",
        });
      }
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المنتج",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button onClick={handleAddProduct}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <p>جاري التحميل...</p>
        </div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductManagement;
