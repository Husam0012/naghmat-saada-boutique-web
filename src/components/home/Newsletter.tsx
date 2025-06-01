
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  const handleWhatsAppRedirect = () => {
    window.open("https://whatsapp.com/channel/0029Vb5c0w1DZ4La5Oeaqc1H", "_blank");
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-l from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 gradient-text">
              انضمي إلى قائمتنا على واتساب
            </h2>
            <p className="text-muted-foreground mb-8">
              اشتركي في قناة واتساب لمتجر نغمات السعادة واحصلي على آخر العروض والخصومات مباشرة
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={handleWhatsAppRedirect}
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-[#25D366] hover:bg-[#20BA5C] transition-colors"
                size="lg"
              >
                انضم إلى القناة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
