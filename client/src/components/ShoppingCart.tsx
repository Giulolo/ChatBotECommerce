import { Link } from 'wouter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="font-poppins font-semibold text-xl">
            Tu carrito ({cart.summary?.itemCount || 0})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto py-6">
          {cart.items && cart.items.length > 0 ? (
            cart.items.map(item => (
              <div key={item.id} className="flex items-center py-4 border-b">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="ml-4 flex-grow">
                  <h3 className="font-poppins font-medium">{item.product.name}</h3>
                  {item.color && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>Color: {item.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        className="px-2 py-1 text-xs hover:bg-gray-100"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="px-2 py-1 text-xs">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                        className="px-2 py-1 text-xs hover:bg-gray-100"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(item.product.price)}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 ml-2"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <i className="fas fa-shopping-cart text-gray-400 text-2xl"></i>
              </div>
              <h3 className="font-poppins font-medium text-lg mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">Añade algunos productos para continuar</p>
              <SheetClose asChild>
                <Button variant="outline" onClick={onClose}>
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
                <span className="font-medium">{formatCurrency(cart.summary?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">{formatCurrency(cart.summary?.shipping || 0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between pt-2">
                <span className="font-poppins font-medium">Total</span>
                <span className="font-poppins font-semibold">{formatCurrency(cart.summary?.total || 0)}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <SheetClose asChild>
                <Link href="/checkout">
                  <Button
                    className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white font-poppins font-medium rounded-xl text-center shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1"
                  >
                    Proceder al pago
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button 
                  variant="outline"
                  className="w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-foreground font-poppins font-medium rounded-xl text-center transition-all"
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
