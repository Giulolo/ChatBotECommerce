import { Link } from 'wouter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

interface ShoppingCartProps {
  open: boolean;
  onClose: () => void;
}

const ShoppingCart = ({ open, onClose }: ShoppingCartProps) => {
  const { cart, updateCartItem, removeCartItem } = useCart();
  
  const handleIncreaseQuantity = (id: number, currentQuantity: number) => {
    updateCartItem(id, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItem(id, currentQuantity - 1);
    }
  };
  
  const handleRemoveItem = (id: number) => {
    removeCartItem(id);
  };
  
  // Format prices
  const formatPrice = (price: string | number) => {
    return parseFloat(price.toString()).toFixed(2);
  };
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full border-l-[#FDBC9B]">
        <SheetHeader>
          <SheetTitle className="text-2xl text-[#CB9C5E]">
            Mi Carrito ({cart.summary?.itemCount || 0})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto py-6">
          {cart.items && cart.items.length > 0 ? (
            <div className="space-y-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex py-4 border-b">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg bg-[#f9f4ee] overflow-hidden flex-shrink-0 p-2">
                    <img 
                      src={item.product.image || ''} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-[#212121]">{item.product.name}</h3>
                    <div className="mt-1 text-[#CB9C5E] font-bold">
                      ${formatPrice(item.product.price)}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 text-sm">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Total for this item */}
                      <div className="text-sm font-medium">
                        ${(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#f9f4ee] flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-[#CB9C5E]" />
              </div>
              <h3 className="font-medium text-lg mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">Añade algunos productos para continuar</p>
              <SheetClose asChild>
                <Button 
                  variant="outline" 
                  className="border-[#CB9C5E] text-[#CB9C5E] hover:bg-amber-50"
                  onClick={onClose}
                >
                  Seguir comprando
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
        
        {cart.items && cart.items.length > 0 && (
          <SheetFooter className="border-t py-4">
            <div className="w-full space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${formatPrice(cart.summary?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">${formatPrice(cart.summary?.shipping || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos</span>
                <span className="font-medium">${formatPrice(cart.summary?.taxes || 0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between pt-2">
                <span className="font-medium text-lg">Total</span>
                <span className="font-bold text-[#CB9C5E] text-lg">${formatPrice(cart.summary?.total || 0)}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <SheetClose asChild>
                <Link href="/checkout">
                  <Button
                    className="w-full py-3 bg-[#CB9C5E] hover:bg-amber-700 text-white rounded-full"
                  >
                    Proceder al pago
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button 
                  variant="outline"
                  className="w-full py-3 border-[#CB9C5E] text-[#CB9C5E] hover:bg-amber-50 rounded-full"
                >
                  Seguir comprando
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
