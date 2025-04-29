import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { OrderWithItems } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, getOrderStatusLabel } from '@/lib/utils';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id);

  // Fetch order details
  const { data: order, isLoading, error } = useQuery<OrderWithItems>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !isNaN(orderId),
  });

  if (isNaN(orderId)) {
    return (
      <div className="py-10 px-4 container mx-auto">
        <Card className="max-w-3xl mx-auto p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-circle text-red-500 text-4xl"></i>
            </div>
          </div>
          <h1 className="font-poppins font-semibold text-3xl mb-3">ID de pedido inválido</h1>
          <p className="text-gray-600 mb-6">El ID del pedido proporcionado no es válido.</p>
          <Link href="/orders">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
              Volver a mis pedidos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-10 px-4 container mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <h2 className="text-2xl font-poppins font-medium">Cargando detalles del pedido...</h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-10 px-4 container mx-auto">
        <Card className="max-w-3xl mx-auto p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-times-circle text-red-500 text-4xl"></i>
            </div>
          </div>
          <h1 className="font-poppins font-semibold text-3xl mb-3">Pedido no encontrado</h1>
          <p className="text-gray-600 mb-6">No pudimos encontrar los detalles del pedido solicitado.</p>
          <Link href="/orders">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
              Volver a mis pedidos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 container mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/orders">
            <Button variant="ghost" className="pl-0">
              <i className="fas fa-arrow-left mr-2"></i>
              Volver a mis pedidos
            </Button>
          </Link>
          <Button variant="outline" className="border border-gray-300 hover:bg-gray-50">
            <i className="fas fa-download mr-2"></i>
            Descargar factura
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center">
                  <h1 className="font-poppins font-semibold text-2xl">Pedido #{order.orderNumber}</h1>
                  <span className={`ml-3 px-3 py-1 ${getOrderStatusLabel(order.status).color} text-xs rounded-full`}>
                    {getOrderStatusLabel(order.status).label}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">Realizado el {formatDate(order.createdAt.toString())}</p>
              </div>
              {order.status === 'shipped' && (
                <Button 
                  className="mt-4 md:mt-0 bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  <i className="fas fa-truck mr-2"></i>
                  Seguir envío
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-poppins font-medium text-lg mb-3">Información de contacto</h3>
                <div className="bg-neutral rounded-lg p-4">
                  <p className="mb-1"><strong>Nombre:</strong> {order.customerName}</p>
                  <p className="mb-1"><strong>Email:</strong> {order.customerEmail}</p>
                  {order.customerPhone && (
                    <p><strong>Teléfono:</strong> {order.customerPhone}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-poppins font-medium text-lg mb-3">Dirección de envío</h3>
                <div className="bg-neutral rounded-lg p-4">
                  <p className="mb-1">{order.shippingAddress}</p>
                  <p className="mb-1">{order.shippingCity}, {order.shippingPostalCode}</p>
                  <p className="mb-1">{order.shippingProvince}, {order.shippingCountry}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <h3 className="font-poppins font-medium text-lg mb-4">Productos</h3>
            
            <div className="mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.productImageUrl} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.productName}</h4>
                      <span className="font-semibold">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="text-sm text-gray-500">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span> | Talla: {item.size}</span>}
                        <span className="ml-2">Cantidad: {item.quantity}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Subtotal: {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral rounded-lg p-5">
              <div className="space-y-3">
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
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="font-poppins font-medium">Total</span>
                  <span className="font-poppins font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-poppins font-medium text-lg mb-4">Información de pago</h3>
            <div className="flex items-center">
              <div className="p-3 bg-neutral rounded-lg mr-3">
                {order.paymentMethod === 'credit-card' ? (
                  <i className="fas fa-credit-card text-gray-600"></i>
                ) : (
                  <i className="fab fa-paypal text-blue-600"></i>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {order.paymentMethod === 'credit-card' ? 'Tarjeta de crédito/débito' : 'PayPal'}
                </p>
                <p className="text-sm text-gray-500">Pagado el {formatDate(order.createdAt.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
