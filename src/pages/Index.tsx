
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/home/Newsletter";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const IndexPage = () => {
  const queryClient = useQueryClient();
  
  // Pre-fetch products and offers on the homepage load
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: () => import("@/services/auth.service").then(m => m.dataService.getProducts()),
    });
    
    queryClient.prefetchQuery({
      queryKey: ["featured-products"],
      queryFn: () => import("@/services/auth.service").then(m => {
        return m.dataService.getProducts().then(products => products.filter(p => p.featured).slice(0, 4));
      }),
    });
  }, [queryClient]);

  return (
    <Layout>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </Layout>
  );
};

export default IndexPage;
