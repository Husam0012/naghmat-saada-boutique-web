
import Layout from "@/components/layout/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 gradient-text text-center">من نحن</h1>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="aspect-[16/9]">
              <img
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000"
                alt="نغمات السعادة"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-display font-bold mb-4 text-primary">قصتنا</h2>
            <p className="mb-6">
              مرحبًا بك في متجر نغمات السعادة، وجهتك المثالية للتسوق الإلكتروني النسائي الراقي. تأسس متجرنا في عام 2020 بهدف واحد: تقديم تجربة تسوق استثنائية للمرأة العربية تجمع بين الأناقة والجودة والتميز.
            </p>
            
            <h2 className="text-2xl font-display font-bold mb-4 text-primary">رؤيتنا</h2>
            <p className="mb-6">
              نسعى لأن نكون الخيار الأول والأمثل للتسوق النسائي في المملكة العربية السعودية والعالم العربي، من خلال تقديم منتجات فريدة تعكس الذوق الرفيع والأناقة العصرية.
            </p>
            
            <h2 className="text-2xl font-display font-bold mb-4 text-primary">رسالتنا</h2>
            <p className="mb-6">
              نهدف إلى إثراء تجربة التسوق الإلكتروني للمرأة العربية من خلال تقديم منتجات متنوعة عالية الجودة بأسعار منافسة، مع ضمان خدمة عملاء استثنائية تلبي جميع احتياجات عملائنا.
            </p>
            
            <h2 className="text-2xl font-display font-bold mb-4 text-primary">قيمنا</h2>
            <ul className="list-disc mr-6 space-y-2 mb-6">
              <li><strong>الجودة:</strong> نلتزم بتقديم منتجات ذات جودة عالية تفوق توقعات عملائنا.</li>
              <li><strong>التميز:</strong> نسعى دائمًا للتميز في كل جانب من جوانب عملنا.</li>
              <li><strong>الأصالة:</strong> نفخر بتقديم منتجات أصيلة تجمع بين الحداثة والأصالة.</li>
              <li><strong>الثقة:</strong> علاقتنا مع عملائنا مبنية على الثقة والشفافية.</li>
              <li><strong>الإبداع:</strong> نشجع الإبداع والابتكار في جميع منتجاتنا وخدماتنا.</li>
            </ul>
            
            <h2 className="text-2xl font-display font-bold mb-4 text-primary">فريقنا</h2>
            <p className="mb-6">
              يتكون فريقنا من مجموعة من المتخصصين الموهوبين والشغوفين في مجال الموضة والتجارة الإلكترونية. نعمل معًا لتقديم تجربة تسوق فريدة ومميزة لكل سيدة عربية.
            </p>
            
            <div className="bg-muted/50 p-6 rounded-lg border border-border mb-6">
              <p className="text-center italic">
                "هدفنا هو أن نضيف لمسة من السعادة والأناقة إلى حياتك اليومية، عبر منتجاتنا المميزة التي تم اختيارها بعناية لتناسب ذوقك وأسلوب حياتك."
              </p>
              <p className="text-center mt-2 font-bold">- فريق نغمات السعادة</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
