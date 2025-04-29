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
      <div className="bg-gradient-to-br from-secondary/40 to-primary/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <h1 className="font-poppins font-bold text-4xl md:text-5xl text-foreground mb-4">
                Encuentra productos excepcionales para tu estilo
              </h1>
              <p className="text-lg text-foreground/80 mb-8">
                Descubre nuestra colección cuidadosamente seleccionada de productos únicos con envío rápido y servicio premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#productos"
                  className="btn-primary"
                >
                  Comprar ahora
                </a>
                <a
                  href="#featured"
                  className="btn-secondary"
                >
                  Ver destacados
                </a>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute -left-16 -top-16 w-64 h-64 bg-accent rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-highlight rounded-full opacity-30 blur-xl"></div>
              <div className="relative bg-primary/20 rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1627384113972-f4c9896e3e31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Featured products showcase"
                  className="w-full rounded-3xl object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-md">
                  <span className="font-poppins font-medium">Minimalista</span>
                </div>
              </div>
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
