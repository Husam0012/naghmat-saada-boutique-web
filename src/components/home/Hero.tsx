
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";



const Hero = () => {
  return (
    
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-l from-[ّ#4b4b4b] to-[#FEF7CD] overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-right md:pl-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 gradient-text">
              متجرك بين يديك
            </h1>
            <h2 className="text-xl md:text-2xl mb-6 text-foreground/80">
              تسوق بأناقة واستمتع بتجربة فريدة
            </h2>
            <p className="text-lg mb-8 text-muted-foreground">
              وجهتك الأولى للتسوق الإلكتروني بكل ثقة وسهولة نسعى دائماً لتوفير تجربة تسوق مميزة من خلال جودة المنتجات، الأسعار المناسبة، وسرعة التوصيل
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 md:mb-0">
              <Button className="text-lg px-8 py-6 rounded-full button-hover">
                تسوق الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6 rounded-full button-hover">
                عروضنا المميزة
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative">
            <div className="bg-white p-4 rounded-2xl shadow-lg transform rotate-3 animation-delay-200">
              <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1000"
                  alt="منتجات متجرك ستور"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute top-1/2 right-1/2 transform translate-x-12 -translate-y-24 bg-secondary/30 rounded-full w-64 h-64 blur-3xl -z-10"></div>
            <div className="absolute top-1/2 right-1/2 transform translate-x-36 translate-y-12 bg-primary/20 rounded-full w-48 h-48 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default Hero;
