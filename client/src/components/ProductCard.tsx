import { Link } from 'wouter';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@shared/schema';
import { formatCurrency, generateStarRating, truncateText } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onShowDetails: (product: Product) => void;
}

const ProductCard = ({ product, onShowDetails }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

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
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
      <div 
        className="cursor-pointer"
        onClick={() => onShowDetails(product)}
      >
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {product.comparePrice && (
            <div className="absolute top-3 right-3">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                -{Math.round((1 - (parseFloat(product.price.toString()) / parseFloat(product.comparePrice.toString()))) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-poppins font-medium text-lg truncate">{product.name}</h3>
          <button 
            onClick={toggleFavorite}
            className={`text-gray-400 hover:text-red-500 transition-colors ${isFavorite ? 'text-red-500' : ''}`}
          >
            <i className={isFavorite ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {truncateText(product.description, 60)}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {generateStarRating(product.rating as number)}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-poppins font-semibold text-lg">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-gray-400 text-sm line-through ml-2">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
