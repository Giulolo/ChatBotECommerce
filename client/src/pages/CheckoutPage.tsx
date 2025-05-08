import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Banknote } from 'lucide-react';

// Define checkout form schema
const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "El nombre es obligatorio"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(6, "El teléfono es obligatorio"),
  shippingAddress: z.string().min(5, "La dirección es obligatoria"),
  shippingCity: z.string().min(2, "La ciudad es obligatoria"),
  shippingPostalCode: z.string().min(4, "El código postal es obligatorio"),
  paymentMethod: z.enum(["credit-card", "cash-on-delivery"], {
    errorMap: () => ({ message: "Selecciona un método de pago" }),
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      shippingCity: "",
      shippingPostalCode: "",
      paymentMethod: "credit-card",
    },
  });
  
  // Handle checkout submission
  const onSubmit = (data: CheckoutFormValues) => {
    if (cart.items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Añade productos al carrito antes de continuar",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate payment processing
    setPaymentProcessing(true);
    
    setTimeout(() => {
      setPaymentProcessing(false);
      setOrderCompleted(true);
      
      // Simulate successful order
      const orderNumber = Math.floor(Math.random() * 10000000);
      
      toast({
        title: "¡Pedido completado!",
        description: `Tu pedido #${orderNumber} ha sido procesado correctamente`,
      });
      
      // Clear cart
      clearCart();
      
      // Navigate to confirmation
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 2000);
  };
  
  // Format prices
  const formatPrice = (price: string | number) => {
    return parseFloat(price.toString()).toFixed(2);
  };

  return (
    <div className="bg-[#FFFAF7] py-10 min-h-screen relative overflow-hidden">
      {/* Decorative circular elements */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FDBC9B] rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#ED8FB1] rounded-full opacity-20 translate-y-1/3 -translate-x-1/4"></div>
      <div className="absolute top-[40%] right-[5%] w-[100px] h-[100px] bg-[#E9D686] rounded-full opacity-30"></div>
      <div className="absolute bottom-[30%] left-[10%] w-[80px] h-[80px] bg-[#EBB477] rounded-full opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-semibold mb-8 text-[#212121]">Checkout</h1>
        
        {orderCompleted ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-[#CB9C5E]">¡Pedido realizado con éxito!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">
                Gracias por tu compra. Hemos enviado un correo electrónico con los detalles de tu pedido.
              </p>
              <Button onClick={() => navigate("/")} className="bg-[#CB9C5E] hover:bg-[#CB9C5E]/80">
                Volver a la tienda
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h2 className="text-xl font-semibold mb-4 text-[#CB9C5E]">Información de contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#f9f4ee] border-0" {...field} />
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
                                  <Input className="bg-[#f9f4ee] border-0" type="email" {...field} />
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
                                  <Input className="bg-[#f9f4ee] border-0" type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Shipping Information */}
                      <div>
                        <h2 className="text-xl font-semibold mb-4 text-[#CB9C5E]">Dirección de envío</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="shippingAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección</FormLabel>
                                  <FormControl>
                                    <Input className="bg-[#f9f4ee] border-0" {...field} />
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
                                  <Input className="bg-[#f9f4ee] border-0" {...field} />
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
                                  <Input className="bg-[#f9f4ee] border-0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Payment Method */}
                      <div>
                        <h2 className="text-xl font-semibold mb-4 text-[#CB9C5E]">Método de pago</h2>
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
                                  <div className={`flex items-center p-4 border rounded-lg ${field.value === 'credit-card' ? 'border-[#CB9C5E] bg-[#f9f4ee]' : 'border-gray-200'}`}>
                                    <FormControl>
                                      <RadioGroupItem value="credit-card" id="credit-card" className="text-[#CB9C5E]" />
                                    </FormControl>
                                    <FormLabel htmlFor="credit-card" className="ml-3 font-medium cursor-pointer">
                                      <div className="flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5 text-[#CB9C5E]" />
                                        <span>Tarjeta de crédito/débito (Pago ficticio)</span>
                                      </div>
                                    </FormLabel>
                                    <div className="ml-auto flex space-x-2">
                                      <div className="w-10 h-6 bg-blue-600 rounded-md"></div>
                                      <div className="w-10 h-6 bg-red-500 rounded-md"></div>
                                      <div className="w-10 h-6 bg-yellow-400 rounded-md"></div>
                                    </div>
                                  </div>
                                  
                                  <div className={`flex items-center p-4 border rounded-lg ${field.value === 'cash-on-delivery' ? 'border-[#CB9C5E] bg-[#f9f4ee]' : 'border-gray-200'}`}>
                                    <FormControl>
                                      <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" className="text-[#CB9C5E]" />
                                    </FormControl>
                                    <FormLabel htmlFor="cash-on-delivery" className="ml-3 font-medium cursor-pointer">
                                      <div className="flex items-center">
                                        <Banknote className="mr-2 h-5 w-5 text-[#CB9C5E]" />
                                        <span>Pago contra entrega</span>
                                      </div>
                                    </FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        className="w-full py-6 bg-[#CB9C5E] hover:bg-[#CB9C5E]/80 text-white rounded-full" 
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando pago...
                          </div>
                        ) : (
                          'Completar compra'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#CB9C5E]">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex py-2">
                        <div className="w-16 h-16 bg-[#f9f4ee] rounded-md overflow-hidden flex-shrink-0 p-1">
                          <img 
                            src={item.product.image || ''} 
                            alt={item.product.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <span className="font-semibold">${formatPrice(item.product.price)}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex justify-between mt-1">
                            <span>Cantidad: {item.quantity}</span>
                            <span>${formatPrice(parseFloat(item.product.price.toString()) * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Empty Cart Message */}
                  {cart.items.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Tu carrito está vacío</p>
                    </div>
                  )}
                  
                  {/* Order Totals */}
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${formatPrice(cart.summary?.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span>${formatPrice(cart.summary?.shipping || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impuestos</span>
                      <span>${formatPrice(cart.summary?.taxes || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-2">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-[#CB9C5E] text-xl">${formatPrice(cart.summary?.total || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;