
import { useState } from "react";
import { Order } from "./OrdersManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
  orders: Order[];
  onUpdateStatus: (order: Order) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "processing":
      return <Badge variant="secondary">قيد المعالجة</Badge>;
    case "shipped":
      return <Badge variant="default">تم الشحن</Badge>;
    case "delivered":
      return <Badge>تم التسليم</Badge>;
    case "cancelled":
      return <Badge variant="destructive">ملغي</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusLabel = (status: string | null) => {
  switch (status) {
    case 'processing':
      return 'قيد المعالجة';
    case 'shipped':
      return 'تم الشحن';
    case 'delivered':
      return 'تم التوصيل';
    case 'cancelled':
      return 'ملغي';
    default:
      return 'غير معروف';
  }
};

export function OrdersTable({ orders, onUpdateStatus }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === null || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث باسم العميل، رقم الهاتف، البريد الإلكتروني، رقم الطلب أو العنوان..."
            className="pl-8 w-full sm:w-[350px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              فلتر الحالة
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuRadioGroup 
              value={statusFilter || "all"} 
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
            >
              <DropdownMenuRadioItem value="all">الكل</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="processing">قيد المعالجة</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="shipped">تم الشحن</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="delivered">تم التوصيل</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cancelled">ملغي</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>اسم العميل</TableHead>
              <TableHead className="hidden md:table-cell">رقم الهاتف</TableHead>
              <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
              <TableHead className="hidden sm:table-cell">المدينة</TableHead>
              <TableHead className="hidden lg:table-cell">عنوان الشحن</TableHead>
              <TableHead className="hidden lg:table-cell">تاريخ الطلب</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center h-24">
                  لا توجد طلبات متاحة
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.customer_phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.customer_email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.city}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px] truncate" title={order.address}>
                    {order.address}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(order.created_at)}</TableCell>
                  <TableCell>{order.total_amount} ريال</TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(order)}>
                      تحديث الحالة
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
