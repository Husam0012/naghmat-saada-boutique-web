
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryProps {
  title: string;
  image: string;
  url: string;
}

const CategoryCard = ({ title, image, url }: CategoryProps) => {
  return (
    <Link to={url} className="block group">
      <div className="relative rounded-2xl overflow-hidden card-hover">
        <div className="aspect-square">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
          <Button variant="outline" size="sm" className="w-fit bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            تسوق الآن
          </Button>
        </div>
      </div>
    </Link>
  );
};

const Categories = () => {
  const categories = [
    {
      title: "ملابس",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000",
      url: "/categories/clothing",
    },
    {
      title: "إكسسوارات",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1000",
      url: "/categories/accessories",
    },
    {
      title: "العناية بالجمال",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=1000",
      url: "/categories/beauty",
    },
    {
      title: "عطور",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1000",
      url: "/categories/perfumes",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">تصنيفاتنا</h2>
          <Link to="/categories" className="text-primary hover:text-primary/80 flex items-center">
            <span className="ml-1">عرض الكل</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
