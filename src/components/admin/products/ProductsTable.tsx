
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number | null;
  category_id: {
    id: string;
    name: string;
  };
  in_stock: boolean;
  featured: boolean;
}

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductsTable = ({ products, onEdit, onDelete }: ProductsTableProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filterText.toLowerCase()) ||
    (product.category_id?.name || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex">
        <Input
          placeholder="البحث عن منتج..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">اسم المنتج</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>السعر القديم</TableHead>
              <TableHead>متوفر</TableHead>
              <TableHead>مميز</TableHead>
              <TableHead className="w-[100px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  لا توجد منتجات متاحة
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category_id?.name || "بدون تصنيف"}</TableCell>
                  <TableCell>{product.price} ر.س</TableCell>
                  <TableCell>{product.old_price ? `${product.old_price} ر.س` : "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.in_stock ? "متوفر" : "غير متوفر"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                      {product.featured ? "نعم" : "لا"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المنتج نهائيًا من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsTable;
