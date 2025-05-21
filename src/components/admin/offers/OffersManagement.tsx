
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/services/auth.service";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import OffersTable from "./OffersTable";
import OfferDialog from "./OfferDialog";
import { Tables } from "@/integrations/supabase/types";

export type Offer = Tables<"offers"> & {
  applies_to_category_id?: {
    id: string;
    name: string;
  } | null;
  applies_to_product_id?: {
    id: string;
    name: string;
  } | null;
};

const OffersManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading, isError } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: dataService.getOffers,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: dataService.getCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: dataService.getProducts,
  });

  const handleAddOffer = () => {
    setSelectedOffer(null);
    setIsDialogOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDialogOpen(true);
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await dataService.deleteOffer(offerId);
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف العرض بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء حذف العرض",
      });
    }
  };

  const handleSaveOffer = async (offerData: any) => {
    try {
      if (selectedOffer) {
        await dataService.updateOffer(selectedOffer.id, offerData);
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث العرض بنجاح",
        });
      } else {
        await dataService.createOffer(offerData);
        toast({
          title: "تم الإضافة بنجاح",
          description: "تم إضافة العرض بنجاح",
        });
      }
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
    } catch (error) {
      console.error("Error saving offer:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ العرض",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>إدارة العروض الخاصة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>خطأ</AlertTitle>
        <AlertDescription>
          حدث خطأ أثناء تحميل العروض. يرجى تحديث الصفحة والمحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة العروض الخاصة</h1>
        <Button onClick={handleAddOffer}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة عرض جديد
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <OffersTable
            offers={offers as Offer[]}
            onEdit={handleEditOffer}
            onDelete={handleDeleteOffer}
          />
        </CardContent>
      </Card>

      <OfferDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        offer={selectedOffer}
        categories={categories}
        products={products}
        onSave={handleSaveOffer}
      />
    </div>
  );
};

export default OffersManagement;
