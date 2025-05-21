
import { useState } from "react";
import { Order } from "./OrdersManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, status: string) => Promise<boolean>;
}

export function OrderStatusDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
}: OrderStatusDialogProps) {
  const [status, setStatus] = useState<string | undefined>(order?.status || undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async () => {
    if (!order || !status) return;
    
    setIsLoading(true);
    
    try {
      const success = await onUpdateStatus(order.id, status);
      
      if (success) {
        toast({
          title: "نجاح",
          description: "تم تحديث حالة الطلب بنجاح",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "خطأ",
          description: "فشل تحديث حالة الطلب",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الطلب",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset status when order changes
  if (order?.status !== status && open) {
    setStatus(order?.status || undefined);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">تحديث حالة الطلب</DialogTitle>
        </DialogHeader>
        
        {order && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">رقم الطلب</Label>
              <div className="col-span-3">
                <span className="font-medium">{order.order_number}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">العميل</Label>
              <div className="col-span-3">
                <p>{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">المبلغ</Label>
              <div className="col-span-3">
                <span className="font-medium">{order.total_amount} ريال</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                الحالة
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر حالة الطلب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">قيد المعالجة</SelectItem>
                  <SelectItem value="shipped">تم الشحن</SelectItem>
                  <SelectItem value="delivered">تم التوصيل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label className="mb-2">العناصر المطلوبة</Label>
              <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                <ul className="space-y-2">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <span>{item.product_name}</span>
                      <Badge variant="outline">{item.quantity}x</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            إلغاء
          </Button>
          <Button onClick={handleStatusChange} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
