import { useEffect } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { OrderWithItems } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';

const OrderConfirmationPage = () => {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber;
  const [, navigate] = useLocation();
  const { clearCart } = useCart();
  
  // Clear cart when order is confirmed
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  // Fetch order details
  const { data: order, isLoading, error } = useQuery<OrderWithItems>({
    queryKey: [`/api/orders/number/${orderNumber}`],
    enabled: !!orderNumber,
  });
  
  if (isLoading) {
    return (
      <div className="py-10 px-4 container mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <h2 className="text-2xl font-poppins font-medium">Cargando información del pedido...</h2>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="py-10 px-4 container mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-times-circle text-red-500 text-4xl"></i>
            </div>
          </div>
          
          <h1 className="font-poppins font-semibold text-3xl mb-3">Pedido no encontrado</h1>
          <p className="text-gray-600 mb-6">No pudimos encontrar la información del pedido solicitado.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white font-poppins font-medium rounded-xl shadow-lg shadow-primary/20">
                Volver a la tienda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-check-circle text-green-500 text-4xl"></i>
            </div>
          </div>
          
          <h1 className="font-poppins font-semibold text-3xl mb-3">¡Pedido completado!</h1>
          <p className="text-gray-600 mb-6">Tu pedido se ha procesado correctamente. Hemos enviado un email con los detalles de tu compra.</p>
          
          <div className="bg-neutral rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-poppins font-medium text-xl">Resumen del pedido</h2>
              <span className="text-sm text-gray-500">Pedido #{order.orderNumber}</span>
            </div>
            
            <div className="border-t border-b py-4 space-y-4 mb-4">
              {order.items.map(item => (
                <div key={item.id} className="flex">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.productImageUrl} 
                      alt={item.productName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.productName}</h3>
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="text-sm text-gray-500 text-left">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span> | Talla: {item.size}</span>}
                      <span className="ml-2">Cantidad: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos</span>
                <span className="font-medium">{formatCurrency(order.taxes)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-poppins font-medium">Total</span>
                <span className="font-poppins font-semibold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-poppins font-medium rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1">
                Ver mis pedidos
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-foreground font-poppins font-medium rounded-xl transition-all">
                Volver a la tienda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
