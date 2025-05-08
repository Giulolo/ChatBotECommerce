import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import ProductCard from '@/components/ProductCard';
import ProductDetails from '@/components/ProductDetails';
import { Link } from 'wouter';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Slider
} from '@/components/ui/slider';
import { ShoppingBag } from 'lucide-react';

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [maxPrice, setMaxPrice] = useState<number>(100);

  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter and sort products whenever products or filter criteria change
  useEffect(() => {
    if (products) {
      let result = [...products];
      
      // Price filter
      result = result.filter(product => {
        const price = parseFloat(product.price.toString());
        return price >= priceRange[0] && price <= priceRange[1];
      });
      
      // Sort
      switch (sortBy) {
        case 'name_asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price_asc':
          result.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
          break;
        case 'price_desc':
          result.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
          break;
        default:
          // Keep original order
          break;
      }
      
      setFilteredProducts(result);
    }
  }, [products, sortBy, priceRange]);
  
  // Find the maximum price when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const highest = Math.max(...products.map(p => parseFloat(p.price.toString())));
      setMaxPrice(Math.ceil(highest));
      setPriceRange([0, highest]);
    }
  }, [products]);

  const handleShowProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailsOpen(true);
  };

  const handleCloseProductDetails = () => {
    setProductDetailsOpen(false);
  };

  // Group products by categories for display
  const productCategories = [
    { name: "Deporte", products: filteredProducts?.slice(0, 4) || [] },
    { name: "Otros items", products: filteredProducts?.slice(0, 4) || [] }
  ];

  return (
    <div className="min-h-screen bg-[#FFFAF7]">
      {/* Hero Section with Featured Product and Circular Elements */}
      <div className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center relative">
            {/* Left side content */}
            <div className="md:w-1/2 py-6 relative z-10">
              <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#212121]">
                Productos artesanales para ti
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Descubre nuestra selección de productos naturales hechos con ingredientes de la mejor calidad.
              </p>
              <Button 
                size="lg" 
                className="px-8 py-6 bg-[#CB9C5E] hover:bg-amber-600 rounded-full"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar productos
              </Button>
            </div>
            
            {/* Right side with main image area and circular elements */}
            <div className="md:w-1/2 relative h-[450px]">
              {/* Main circle background */}
              <div className="absolute right-0 top-0 w-[450px] h-[450px] bg-[#FDBC9B] rounded-full"></div>
              
              {/* Featured product image */}
              <div className="absolute right-[75px] top-[75px] w-[300px] h-[300px] flex items-center justify-center z-10">
                {!isLoadingProducts && products && products.length > 0 && (
                  <div className="text-center w-full">
                    <img 
                      src={products[0].image || ''} 
                      alt={products[0].name} 
                      className="w-full h-full object-contain"
                    />
                    <Button 
                      className="mt-6 bg-amber-500 hover:bg-amber-600 rounded-full px-6"
                      onClick={() => handleShowProductDetails(products[0])}
                    >
                      Comprar <span className="ml-2 font-bold">${parseFloat(products[0].price.toString()).toFixed(2)}</span>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Decorative circles */}
              <div className="absolute top-[10px] right-[-60px] w-[120px] h-[120px] bg-[#E9D686] rounded-full z-0"></div>
              <div className="absolute top-[200px] right-[-80px] w-[120px] h-[120px] bg-[#ED8FB1] rounded-full z-0"></div>
              <div className="absolute top-[350px] right-[-50px] w-[120px] h-[120px] bg-[#EBB477] rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section with Filters */}
      <div className="py-12 bg-white" id="productos">
        <div className="container mx-auto px-4">
          {/* Filter and Sort Controls */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-semibold">Nuestros Productos</h2>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Price Range Filter */}
              <div className="w-full md:w-64">
                <p className="mb-2 text-sm font-medium">Precio: ${priceRange[0]} - ${priceRange[1]}</p>
                <Slider
                  defaultValue={[0, maxPrice]}
                  max={maxPrice}
                  step={1}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="w-full"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="w-full md:w-64">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por defecto</SelectItem>
                    <SelectItem value="name_asc">Nombre (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Nombre (Z-A)</SelectItem>
                    <SelectItem value="price_asc">Precio (menor a mayor)</SelectItem>
                    <SelectItem value="price_desc">Precio (mayor a menor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product categories display */}
          {productCategories.map((category, index) => (
            <div key={index} className="mb-16">
              <h3 className="text-2xl font-semibold mb-6">{category.name}</h3>
              
              {isLoadingProducts ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="bg-gray-100 animate-pulse rounded-lg p-4 aspect-[4/5]"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onShowDetails={handleShowProductDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* No products found message */}
          {!isLoadingProducts && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Prueba con otros filtros</p>
            </div>
          )}
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
