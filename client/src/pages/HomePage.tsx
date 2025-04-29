import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@shared/schema';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import ProductDetails from '@/components/ProductDetails';
import { Link } from 'wouter';

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);

  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleShowProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailsOpen(true);
  };

  const handleCloseProductDetails = () => {
    setProductDetailsOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center relative">
            {/* Left side text content */}
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 relative z-10">
              <h1 className="font-knewave text-5xl md:text-8xl text-[#ED8FB1] leading-tight mb-10">
                e-Commerse<br/>Website
              </h1>
              
              {/* Light pink rectangle */}
              <div className="bg-[#F5E2D9] rounded-lg w-full md:w-[309px] h-20 mb-4 flex items-center px-4">
                <span className="text-[#CB9C5E] font-bree-serif text-xl">...</span>
              </div>
              
              {/* Buy now button */}
              <button className="bg-[#CB9C5E] text-white rounded-full px-12 py-4 shadow-lg flex items-center mt-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-shopping-cart text-[#CB9C5E]"></i>
                </div>
                <span className="font-bree-serif text-xl">Comprar ahora</span>
              </button>
            </div>
            
            {/* Right side with circular elements */}
            <div className="md:w-1/2 relative">
              {/* Main peach circle */}
              <div className="absolute right-0 top-0 w-[450px] h-[450px] bg-[#FDBC9B] rounded-full"></div>
              
              {/* Product image label */}
              <div className="absolute right-[100px] top-[200px] text-center z-20">
                <span className="font-inter text-lg">img del producto</span>
              </div>
              
              {/* White rounded rectangle with Minimalistic text */}
              <div className="absolute top-[50px] right-[100px] bg-white px-8 py-4 rounded-full shadow-md z-20">
                <span className="font-bree-serif text-2xl text-[#CB9C5E]">Minimalista</span>
              </div>
              
              {/* Text dots */}
              <div className="absolute top-[350px] left-[150px] bg-white px-6 py-3 rounded-full shadow-md z-20">
                <span className="font-bree-serif text-xl text-[#CB9C5E]">...</span>
              </div>
              
              {/* Right decorative circles */}
              <div className="absolute top-[10px] right-[-50px] w-[131px] h-[133px] bg-[#E9D686] rounded-full z-10">
                <div className="absolute top-[50px] left-[30px] text-center">
                  <span className="font-inter text-sm leading-tight">img de<br/>otro p</span>
                </div>
              </div>
              <div className="absolute top-[170px] right-[-80px] w-[131px] h-[133px] bg-[#ED8FB1] rounded-full z-10"></div>
              <div className="absolute top-[340px] right-[-80px] w-[131px] h-[133px] bg-[#EBB477] rounded-full z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16" id="featured">
        <div className="container mx-auto px-4">
          <h2 className="font-poppins font-semibold text-3xl text-center mb-12">Categorías populares</h2>

          {isLoadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-neutral" id="productos">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-poppins font-semibold text-3xl">Productos destacados</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-lg bg-white shadow-sm hover:bg-gray-50">
                <i className="fas fa-chevron-left"></i>
              </Button>
              <Button variant="outline" size="icon" className="rounded-lg bg-white shadow-sm hover:bg-gray-50">
                <i className="fas fa-chevron-right"></i>
              </Button>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-4">
                  <div className="aspect-square bg-gray-200 animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                  <div className="h-4 bg-gray-200 animate-pulse mb-4 rounded-md"></div>
                  <div className="flex justify-between">
                    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onShowDetails={handleShowProductDetails}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/#productos" className="inline-flex items-center px-6 py-3 font-poppins font-medium text-primary hover:text-primary/80 transition-colors">
              Ver todos los productos
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        open={productDetailsOpen}
        onClose={handleCloseProductDetails}
      />
    </div>
  );
};

export default HomePage;
