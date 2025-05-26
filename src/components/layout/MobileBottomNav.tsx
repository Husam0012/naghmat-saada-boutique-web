
import { Link, useLocation } from "react-router-dom";
import { Home, Package, Tag, ShoppingCart, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileBottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }

  const navItems = [
    {
      name: "الرئيسية",
      icon: Home,
      path: "/",
    },
    {
      name: "المنتجات",
      icon: Package,
      path: "/products",
    },
    {
      name: "العروض",
      icon: Tag,
      path: "/special-offers",
    },
    {
      name: "السلة",
      icon: ShoppingCart,
      path: "/cart",
    },
    {
      name: "حسابي",
      icon: User,
      path: "/account",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${active ? "text-primary" : ""}`} />
              <span className={`text-xs text-center truncate ${
                active ? "text-primary font-medium" : ""
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
