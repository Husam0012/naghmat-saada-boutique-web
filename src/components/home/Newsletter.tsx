
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "تم الاشتراك بنجاح!",
        description: "سنقوم بإرسال آخر العروض والأخبار إلى بريدك الإلكتروني.",
      });
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-l from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 gradient-text">انضمي إلى قائمتنا البريدية</h2>
            <p className="text-muted-foreground mb-8">
              اشتركي في النشرة البريدية لمتجر نغمات السعادة واحصلي على آخر العروض والخصومات مباشرة إلى بريدك الإلكتروني
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="flex-1"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "جاري الإرسال..." : "اشتراك"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
