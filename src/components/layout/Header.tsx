
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle.tsx";
import { SearchDialog } from "@/components/ui/search-dialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/e45d98e8-4977-4f11-942d-aa0807b70a3c.png" 
              alt="متجرك ستور" 
              className="h-20 w-auto"
            />
            <span className="text-2xl font-display font-bold mr-2 gradient-text">متجرك ستور</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0 space-x-reverse space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">الرئيسية</Link>
            <Link to="/categories" className="text-foreground hover:text-primary transition-colors">التصنيفات</Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">المنتجات</Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">من نحن</Link>
            <Link to="/OrderTracking" className="text-foreground hover:text-primary transition-colors">تتبع الطلب</Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">اتصل بنا</Link>
             <ThemeToggle />
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-0 space-x-reverse space-x-4">
            <SearchDialog />
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
           
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">الرئيسية</Link>
              <Link to="/categories" className="text-foreground hover:text-primary transition-colors py-2">التصنيفات</Link>
              <Link to="/products" className="text-foreground hover:text-primary transition-colors py-2">المنتجات</Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors py-2">من نحن</Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors py-2">اتصل بنا</Link>
              <ThemeToggle />
            </nav>
            <div className="flex justify-around mt-4 pt-4 border-t border-border">
              <SearchDialog />
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
