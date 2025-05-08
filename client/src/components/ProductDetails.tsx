import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Product } from "@shared/schema";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingCart, Tag } from "lucide-react";
import { Link } from "wouter";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetails = ({ product, open, onClose }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity
    });
    
    toast({
      title: "Añadido al carrito",
      description: `${quantity} x ${product.name} ha sido añadido a tu carrito`,
      duration: 3000
    });
    
    onClose();
  };

  const handleProceedToCheckout = () => {
    addToCart({
      productId: product.id,
      quantity
    });
    
    onClose();
    window.location.href = "/checkout";
  };

  const price = parseFloat(product.price.toString());
  const formattedPrice = price.toFixed(2);
  const totalPrice = (price * quantity).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#CB9C5E] text-2xl">Detalles del producto</DialogTitle>
          <DialogClose />
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-[#FDBC9B] rounded-xl p-6 flex items-center justify-center">
            <img 
              src={product.image || ''}
              alt={product.name} 
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-semibold mb-3">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <Tag className="text-[#CB9C5E] mr-2 h-5 w-5" />
              <span className="text-2xl font-bold text-[#CB9C5E]">${formattedPrice}</span>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                {product.description || 'Sin descripción disponible'}
              </p>
            </div>
            
            {/* Quantity Selector */}
            <div className="border-t border-b py-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Cantidad</span>
                
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handleDecreaseQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="mx-4 font-medium">{quantity}</span>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handleIncreaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Total Price */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="text-xl font-bold text-[#CB9C5E]">${totalPrice}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-[#CB9C5E] hover:bg-amber-600 text-white rounded-full py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir al carrito
              </Button>
              
              <Button 
                onClick={handleProceedToCheckout}
                variant="outline"
                className="w-full border-[#CB9C5E] text-[#CB9C5E] hover:bg-amber-50 rounded-full py-3"
              >
                Comprar ahora
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
