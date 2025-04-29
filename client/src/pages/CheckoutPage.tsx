import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

const checkoutFormSchema = z.object({
  customerName: z.string().min(1, "El nombre es obligatorio"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(1, "El teléfono es obligatorio"),
  shippingAddress: z.string().min(1, "La dirección es obligatoria"),
  shippingCity: z.string().min(1, "La ciudad es obligatoria"),
  shippingPostalCode: z.string().min(1, "El código postal es obligatorio"),
  shippingProvince: z.string().min(1, "La provincia es obligatoria"),
  shippingCountry: z.string().min(1, "El país es obligatorio"),
  paymentMethod: z.enum(["credit-card", "paypal"], {
    errorMap: () => ({ message: "Selecciona un método de pago" }),
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVV: z.string().optional(),
  cardName: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  const { cart, isLoading: isCartLoading } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      shippingCity: "",
      shippingPostalCode: "",
      shippingProvince: "",
      shippingCountry: "España",
      paymentMethod: "credit-card",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
      cardName: "",
    },
  });
  
  const createOrder = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const response = await apiRequest('POST', '/api/orders', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "¡Pedido completado!",
        description: "Tu pedido ha sido procesado correctamente",
      });
      navigate(`/order-confirmation/${data.orderNumber}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al procesar el pedido",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: CheckoutFormValues) => {
    if (cart.items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Añade productos al carrito antes de continuar",
        variant: "destructive",
      });
      return;
    }
    
    createOrder.mutate(data);
  };
  
  return (
    <section className="py-10 px-4 md:px-0">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="font-poppins font-semibold text-3xl mb-6">Finalizar compra</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="font-poppins font-medium text-xl mb-4">Información de contacto</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="font-poppins font-medium text-xl mb-4">Dirección de envío</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="shippingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="shippingPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código postal</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="shippingProvince"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                              <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                {...field}
                              >
                                <option value="">Seleccionar provincia</option>
                                <option value="Madrid">Madrid</option>
                                <option value="Barcelona">Barcelona</option>
                                <option value="Valencia">Valencia</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="shippingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País</FormLabel>
                            <FormControl>
                              <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                {...field}
                              >
                                <option value="España">España</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Francia">Francia</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="font-poppins font-medium text-xl mb-4">Método de pago</h2>
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              className="space-y-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                                <FormControl>
                                  <RadioGroupItem value="credit-card" id="credit-card" className="h-4 w-4 text-primary focus:ring-primary/30" />
                                </FormControl>
                                <FormLabel htmlFor="credit-card" className="ml-3 font-medium">Tarjeta de crédito/débito</FormLabel>
                                <div className="ml-auto flex space-x-2">
                                  <i className="fab fa-cc-visa text-blue-700 text-2xl"></i>
                                  <i className="fab fa-cc-mastercard text-red-500 text-2xl"></i>
                                  <i className="fab fa-cc-amex text-blue-500 text-2xl"></i>
                                </div>
                              </div>
                              
                              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                                <FormControl>
                                  <RadioGroupItem value="paypal" id="paypal" className="h-4 w-4 text-primary focus:ring-primary/30" />
                                </FormControl>
                                <FormLabel htmlFor="paypal" className="ml-3 font-medium">PayPal</FormLabel>
                                <div className="ml-auto">
                                  <i className="fab fa-paypal text-blue-600 text-2xl"></i>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('paymentMethod') === 'credit-card' && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de tarjeta</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234 5678 9012 3456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de expiración</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/AA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardCVV"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre en la tarjeta</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-poppins font-medium rounded-xl text-center shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1"
                  disabled={createOrder.isPending || isCartLoading}
                >
                  {createOrder.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Procesando...
                    </>
                  ) : (
                    "Finalizar compra"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="md:w-1/3">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-poppins font-medium text-xl mb-4">Resumen de compra</h2>
                
                {isCartLoading ? (
                  <div className="space-y-4 mb-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="ml-3 flex-grow">
                          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {cart.items && cart.items.length > 0 ? (
                      cart.items.map(item => (
                        <div key={item.id} className="flex">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.product.name}</h3>
                              <span className="font-medium">{formatCurrency(item.product.price)}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span> | Talla: {item.size}</span>}
                              <span className="ml-2">Cantidad: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p>No hay productos en el carrito</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cart.summary?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">{formatCurrency(cart.summary?.shipping || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-medium">{formatCurrency(cart.summary?.taxes || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-poppins font-medium">Total</span>
                    <span className="font-poppins font-semibold">{formatCurrency(cart.summary?.total || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
