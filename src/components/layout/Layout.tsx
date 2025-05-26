
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import MobileBottomNav from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isMobile ? 'pb-16' : ''}`}>
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
