import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@shared/schema';
import { formatCurrency, truncateText } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onShowDetails: (product: Product) => void;
}

const ProductCard = ({ product, onShowDetails }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      quantity: 1
    });
    
    toast({
      title: "Añadido al carrito",
      description: `${product.name} ha sido añadido a tu carrito`,
      duration: 3000
    });
  };

  return (
    <div 
      className="bg-[#f9f4ee] rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
      onClick={() => onShowDetails(product)}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-[4/3] bg-white rounded-md overflow-hidden mb-3">
          <img 
            src={product.image || ''}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Product Name */}
        <h3 className="font-medium text-[#212121] mb-1 truncate">{product.name}</h3>
        
        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(product.description || '', 60)}
        </p>
        
        {/* Price and Buy Button */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#CB9C5E]">
            ${parseFloat(product.price.toString()).toFixed(2)}
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full border-[#CB9C5E] text-[#CB9C5E] hover:bg-[#CB9C5E] hover:text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
