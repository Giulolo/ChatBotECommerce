import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Product } from "@shared/schema";
import { formatCurrency, generateStarRating } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetails = ({ product, open, onClose }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedImage, setSelectedImage] = useState(0);
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
      quantity,
      color: selectedColor
    });
    
    toast({
      title: "Añadido al carrito",
      description: `${quantity} x ${product.name} ha sido añadido a tu carrito`,
      duration: 3000
    });
    
    onClose();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const colors = [
    { name: 'Negro', value: 'black' },
    { name: 'Blanco', value: 'white' },
    { name: 'Azul', value: 'blue-500' },
    { name: 'Rojo', value: 'red-500' }
  ];

  // Select the main image and additional images
  const mainImage = product.imageUrls?.[selectedImage] || product.imageUrl;
  const additionalImages = product.imageUrls || [product.imageUrl];

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins font-semibold text-2xl">Detalles del producto</DialogTitle>
          <DialogClose />
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-neutral rounded-xl overflow-hidden">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full object-cover"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {additionalImages.map((image, index) => (
                <button 
                  key={index}
                  className={`border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent hover:border-primary'} rounded-lg overflow-hidden`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} vista ${index + 1}`} 
                    className="w-full aspect-square object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <h1 className="font-poppins font-semibold text-2xl">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {generateStarRating(product.rating as number)}
                </div>
                <span className="text-gray-500 ml-2">({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="font-poppins font-semibold text-2xl">{formatCurrency(product.price)}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-gray-400 text-lg line-through ml-3">{formatCurrency(product.comparePrice)}</span>
                    <span className="ml-3 bg-primary text-white text-sm px-2 py-1 rounded-full">
                      -{Math.round((1 - (parseFloat(product.price.toString()) / parseFloat(product.comparePrice.toString()))) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-green-600 text-sm">
                <i className="fas fa-check-circle mr-1"></i> En stock - Envío en 24 horas
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-poppins font-medium mb-2">Descripción</h3>
              <p className="text-gray-600">
                {product.description}
              </p>
              <ul className="mt-3 space-y-1 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
                  <span>Cancelación de ruido activa</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
                  <span>Bluetooth 5.0 con alcance de 10m</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
                  <span>Batería de 30 horas de duración</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
                  <span>Controles táctiles intuitivos</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-poppins font-medium mb-3">Color</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button 
                    key={color.value}
                    className={`w-8 h-8 rounded-full bg-${color.value} ${color.value === 'white' ? 'border border-gray-300' : ''} ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                    onClick={() => handleColorSelect(color.value)}
                    aria-label={`Color ${color.name}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center border rounded-lg mr-4">
                  <button 
                    onClick={handleDecreaseQuantity}
                    className="px-3 py-2 border-r hover:bg-gray-100"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button 
                    onClick={handleIncreaseQuantity}
                    className="px-3 py-2 border-l hover:bg-gray-100"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <span className="text-gray-500">Disponible: 12 unidades</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-poppins font-medium rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1"
                >
                  <i className="fas fa-cart-plus mr-2"></i> Añadir al carrito
                </Button>
                <Button 
                  variant="outline"
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-foreground font-poppins font-medium rounded-xl transition-all"
                >
                  <i className="far fa-heart mr-2"></i> Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
