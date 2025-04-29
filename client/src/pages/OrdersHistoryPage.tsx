import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { OrderWithItems } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate, getOrderStatusLabel } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const OrdersHistoryPage = () => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch orders by email
  const { data: orders, isLoading, error, refetch } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/orders', email],
    enabled: emailSubmitted && email.length > 0,
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para ver tus pedidos",
        variant: "destructive"
      });
      return;
    }
    setEmailSubmitted(true);
    refetch();
  };

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h1 className="font-poppins font-semibold text-3xl mb-8">Mis pedidos</h1>

        {!emailSubmitted && (
          <Card className="max-w-md mx-auto p-6 mb-8">
            <h2 className="font-poppins font-medium text-xl mb-4">Encuentra tus pedidos</h2>
            <p className="mb-4 text-gray-600">Ingresa el email que usaste para realizar tu compra</p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-poppins font-medium"
              >
                Buscar mis pedidos
              </Button>
            </form>
          </Card>
        )}

        {emailSubmitted && isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <h2 className="text-xl font-medium">Buscando pedidos...</h2>
          </div>
        )}

        {emailSubmitted && error && (
          <div className="bg-red-50 p-6 rounded-xl text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
            </div>
            <h2 className="font-poppins font-medium text-xl mb-2">Error al buscar pedidos</h2>
            <p className="text-gray-600 mb-4">No pudimos encontrar tus pedidos. Por favor intenta nuevamente.</p>
            <Button
              variant="outline"
              onClick={() => setEmailSubmitted(false)}
              className="border border-gray-300 hover:bg-gray-50"
            >
              Volver a intentar
            </Button>
          </div>
        )}

        {emailSubmitted && orders && orders.length === 0 && (
          <div className="bg-neutral p-6 rounded-xl text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-white p-3">
                <i className="fas fa-search text-gray-400 text-xl"></i>
              </div>
            </div>
            <h2 className="font-poppins font-medium text-xl mb-2">No se encontraron pedidos</h2>
            <p className="text-gray-600 mb-4">No encontramos pedidos asociados con el email {email}</p>
            <Button
              variant="outline"
              onClick={() => setEmailSubmitted(false)}
              className="border border-gray-300 hover:bg-gray-50"
            >
              Intentar con otro email
            </Button>
          </div>
        )}

        {emailSubmitted && orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h2 className="font-poppins font-medium text-xl">Pedido #{order.orderNumber}</h2>
                        <span className={`ml-3 px-3 py-1 ${getOrderStatusLabel(order.status).color} text-xs rounded-full`}>
                          {getOrderStatusLabel(order.status).label}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1">Realizado el {formatDate(order.createdAt.toString())}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                      <span className="font-poppins font-semibold text-lg">{formatCurrency(order.total)}</span>
                      <span className="text-sm text-gray-500">{order.items.length} productos</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start">
                    <div className="flex-grow mb-6 sm:mb-0 sm:mr-6">
                      <div className="flex flex-wrap gap-4">
                        {order.items.slice(0, 4).map((item) => (
                          <div key={item.id} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.productImageUrl} 
                              alt={item.productName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="secondary" className="bg-primary/10 text-primary font-poppins font-medium hover:bg-primary/20">
                          Ver detalles
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border border-gray-300 text-foreground font-poppins font-medium hover:bg-gray-50"
                      >
                        Descargar factura
                      </Button>
                      {order.status === 'shipped' && (
                        <Button
                          variant="outline"
                          className="border border-gray-300 text-foreground font-poppins font-medium hover:bg-gray-50"
                        >
                          Seguir envío
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersHistoryPage;
