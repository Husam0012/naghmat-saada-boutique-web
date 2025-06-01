
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { dataService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

interface StoreSettings {
  store_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_instagram?: string;
  social_facebook?: string;
  logo_url?: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "متجرك ستور",
    contact_email: "support@matjarik.shop",
    contact_phone: "+967730989442",
    address: "صنعاء-الجمهورية اليمنية",
    logo_url: "/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png"
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: dataService.getCategories,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storeSettings = await dataService.getStoreSettings();
        if (storeSettings) {
          setSettings(storeSettings);
        }
      } catch (error) {
        console.error("Error loading store settings:", error);
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="bg-muted pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={settings.logo_url || "/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png"} alt={settings.store_name || "متجرك ستور"} className="h-20 w-auto" />
              <h3 className="text-xl font-display font-bold mr-2 gradient-text">{settings.store_name || "متجرك ستور"}</h3>
            </div>
            <p className="text-muted-foreground mb-4">متجر إلكتروني متخصص بتوفير منتجات عالية الجودة للمستحضرات التجميل وعناية الشخصية وطب وصحة</p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="https://www.instagram.com/mat.jarik?igsh=aWtueHI5NjBndGx0" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61576584311293&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://wa.me/967730989442" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.447 3.553a12.695 12.695 0 00-17.912 17.912L1 24l2.534-1.535a12.695 12.695 0 0017.912-17.912zM12.238 21.452a10.56 10.56 0 01-5.38-1.475l-.385-.23-4.004 1.05 1.07-3.91-.253-.402a10.56 10.56 0 01-1.475-5.38c0-5.834 4.747-10.58 10.58-10.58 5.834 0 10.58 4.747 10.58 10.58 0 5.834-4.747 10.58-10.58 10.58zm5.82-7.91c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-.987 1.253-.16.213-.32.24-.64.08-.32-.16-1.35-.497-2.57-1.583-.95-.847-1.59-1.893-1.777-2.213-.187-.32-.02-.493.14-.653.143-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.527-.54-.72-.55-.187-.01-.4-.01-.613-.01-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.827.763.33 1.36.527 1.827.677.768.243 1.467.21 2.02.127.616-.093 1.89-.773 2.153-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">المنتجات</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">التصنيفات</Link></li>
              <li><Link to="/special-offers" className="hover:text-primary transition-colors">العروض الخاصة</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link to="/OrderTracking" className="text-foreground hover:text-primary transition-colors">تتبع الطلب</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">التصنيفات</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category: any) => (
                <li key={category.id}>
                  <Link 
                    to={`/products?category=${category.id}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 ml-2 text-primary" />
                <a href="tel:+967730989442" className="hover:text-primary transition-colors">
                  +967730989442
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 ml-2 text-primary" />
                <a href="mailto:support@matjarik.shop" className="hover:text-primary transition-colors">
                  support@matjarik.shop
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 ml-2 mt-1 text-primary" />
                <address className="not-italic">
                  صنعاء<br />
                  الجمهورية اليمنية
                </address>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings.store_name || "متجرك ستور"}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
