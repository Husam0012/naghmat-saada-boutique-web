
import { useState } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Offer } from "./OffersManagement";

interface OffersTableProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
}

const OffersTable = ({ offers, onEdit, onDelete }: OffersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  const getStatusBadge = (offer: Offer) => {
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);
    
    if (!offer.is_active) {
      return <Badge variant="outline">غير نشط</Badge>;
    }
    
    if (now < startDate) {
      return <Badge variant="secondary">قادم</Badge>;
    } else if (now > endDate) {
      return <Badge variant="destructive">منتهي</Badge>;
    } else {
      return <Badge variant="default">نشط</Badge>;
    }
  };

  const getOfferTarget = (offer: Offer) => {
    if (offer.applies_to_category_id) {
      return `تصنيف: ${offer.applies_to_category_id.name}`;
    } else if (offer.applies_to_product_id) {
      return `منتج: ${offer.applies_to_product_id.name}`;
    } else {
      return "جميع المنتجات";
    }
  };

  const getDiscountValue = (offer: Offer) => {
    if (offer.discount_percentage) {
      return `${offer.discount_percentage}%`;
    } else if (offer.discount_amount) {
      return `${offer.discount_amount} ريال`;
    } else {
      return "-";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث عن عروض..."
            className="pl-8 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>القيمة</TableHead>
              <TableHead>يطبق على</TableHead>
              <TableHead>البداية</TableHead>
              <TableHead>النهاية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  لا توجد عروض مطابقة للبحث
                </TableCell>
              </TableRow>
            ) : (
              filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.title}</TableCell>
                  <TableCell>{getDiscountValue(offer)}</TableCell>
                  <TableCell>{getOfferTarget(offer)}</TableCell>
                  <TableCell>{formatDate(offer.start_date)}</TableCell>
                  <TableCell>{formatDate(offer.end_date)}</TableCell>
                  <TableCell>{getStatusBadge(offer)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(offer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من رغبتك في حذف هذا العرض؟ لا يمكن
                              التراجع عن هذه العملية.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(offer.id)}
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OffersTable;
