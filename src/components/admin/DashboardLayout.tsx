
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Tag, Settings, User, BarChart3, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <Button 
        variant={active ? "default" : "ghost"} 
        className={`w-full justify-start ${active ? 'bg-primary' : ''}`}
      >
        <span className="ml-2">{icon}</span>
        {label}
      </Button>
    </Link>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    toast({
      title: "تم تسجيل الخروج بنجاح",
      description: "شكراً لاستخدامك لوحة تحكم نغمات السعادة",
    });
    navigate("/admin");
  };

  const sidebarItems = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "لوحة المعلومات",
      to: "/admin/dashboard",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "الطلبات",
      to: "/admin/orders",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "المنتجات",
      to: "/admin/products",
    },
    {
      icon: <Tag className="h-5 w-5" />,
      label: "التصنيفات",
      to: "/admin/categories",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "الإعدادات",
      to: "/admin/settings",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar for desktop */}
      <aside 
        className={`
          ${isMobile ? 'fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out' : 'w-64'} 
          ${isMobile && sidebarOpen ? 'translate-x-0' : isMobile ? 'translate-x-full' : ''}
          bg-white shadow-md
        `}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png" 
              alt="نغمات السعادة" 
              className="h-10 w-auto"
            />
            <h2 className="text-lg font-bold mr-2 gradient-text">نغمات السعادة</h2>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
              />
            ))}
          </div>
          <div className="mt-8 pt-8 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <span className="ml-2">
                <User className="h-5 w-5" />
              </span>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        {isMobile && (
          <header className="bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png" 
                alt="نغمات السعادة" 
                className="h-8 w-auto"
              />
              <h2 className="text-lg font-bold mr-2 gradient-text">لوحة التحكم</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          </header>
        )}

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
