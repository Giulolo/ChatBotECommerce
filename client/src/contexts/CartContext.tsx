import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { CartItem, Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface CartSummary {
  subtotal: string;
  shipping: string;
  taxes: string;
  total: string;
  itemCount: number;
}

interface Cart {
  items: (CartItem & { product: Product })[];
  summary: CartSummary;
}

interface CartContextType {
  cart: Cart;
  sessionId: string | null;
  setSessionId: (id: string) => void;
  addToCart: (item: { productId: number; quantity: number; color?: string; size?: string }) => void;
  updateCartItem: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  isError: boolean;
}

const CartContext = createContext<CartContextType>({
  cart: { items: [], summary: { subtotal: '0', shipping: '0', taxes: '0', total: '0', itemCount: 0 } },
  sessionId: null,
  setSessionId: () => {},
  addToCart: () => {},
  updateCartItem: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  isLoading: false,
  isError: false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Intentar recuperar el carrito del localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
    // Si no hay carrito en localStorage o hay un error, usar el estado inicial
    return { 
      items: [], 
      summary: { subtotal: '0', shipping: '0', taxes: '0', total: '0', itemCount: 0 } 
    };
  });
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch cart when sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId]);

  const fetchCart = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await apiRequest('GET', '/api/cart', undefined, {
        headers: {
          'X-Session-ID': sessionId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setIsError(true);
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: { productId: number; quantity: number; color?: string; size?: string }) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // Primero intentamos obtener el producto
      const productResponse = await fetch(`/api/products/${item.productId}`);
      if (!productResponse.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const product = await productResponse.json();
      
      // Agregar al carrito de la API
      try {
        const response = await apiRequest('POST', '/api/cart', { ...item }, {
          headers: {
            'X-Session-ID': sessionId
          }
        });
        
        const data = await response.json();
        setCart(data);
      } catch (apiError) {
        console.error('Error calling API, using local cart:', apiError);
        
        // Si falla la API, actualizar el carrito localmente
        const existingItemIndex = cart.items.findIndex(
          cartItem => cartItem.productId === item.productId
        );
        
        let updatedItems = [...cart.items];
        
        if (existingItemIndex >= 0) {
          // Actualizar cantidad si el producto ya está en el carrito
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity
          };
        } else {
          // Agregar nuevo item
          updatedItems.push({
            id: Date.now(), // ID temporal local
            productId: item.productId,
            sessionId: sessionId,
            quantity: item.quantity,
            createdAt: new Date(),
            userId: null,
            product: product
          });
        }
        
        // Recalcular totales
        let subtotal = 0;
        updatedItems.forEach(item => {
          const itemPrice = parseFloat(item.product.price.toString());
          subtotal += itemPrice * item.quantity;
        });
        
        const shipping = updatedItems.length > 0 ? 9.99 : 0;
        const taxes = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + taxes;
        
        setCart({
          items: updatedItems,
          summary: {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            taxes: taxes.toFixed(2),
            total: total.toFixed(2),
            itemCount: updatedItems.reduce((acc, item) => acc + item.quantity, 0)
          }
        });
        
        toast({
          title: "Producto añadido",
          description: "El producto se añadió al carrito local",
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "No se pudo añadir el producto al carrito",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // Intentar usar la API
      try {
        const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity }, {
          headers: {
            'X-Session-ID': sessionId
          }
        });
        
        const data = await response.json();
        setCart(data);
      } catch (apiError) {
        console.error('Error calling API, updating cart locally:', apiError);
        
        // Si la API falla, actualizamos el carrito localmente
        const updatedItems = cart.items.map(item => {
          if (item.id === id) {
            return { ...item, quantity };
          }
          return item;
        });
        
        // Recalcular totales
        let subtotal = 0;
        updatedItems.forEach(item => {
          const itemPrice = parseFloat(item.product.price.toString());
          subtotal += itemPrice * item.quantity;
        });
        
        const shipping = updatedItems.length > 0 ? 9.99 : 0;
        const taxes = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + taxes;
        
        setCart({
          items: updatedItems,
          summary: {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            taxes: taxes.toFixed(2),
            total: total.toFixed(2),
            itemCount: updatedItems.reduce((acc, item) => acc + item.quantity, 0)
          }
        });
        
        toast({
          title: "Carrito actualizado",
          description: "El producto se actualizó en el carrito local",
        });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto en el carrito",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (id: number) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // Intentar usar la API
      try {
        const response = await apiRequest('DELETE', `/api/cart/${id}`, undefined, {
          headers: {
            'X-Session-ID': sessionId
          }
        });
        
        const data = await response.json();
        setCart(data);
      } catch (apiError) {
        console.error('Error calling API, removing item locally:', apiError);
        
        // Si la API falla, eliminamos el producto localmente
        const updatedItems = cart.items.filter(item => item.id !== id);
        
        // Recalcular totales
        let subtotal = 0;
        updatedItems.forEach(item => {
          const itemPrice = parseFloat(item.product.price.toString());
          subtotal += itemPrice * item.quantity;
        });
        
        const shipping = updatedItems.length > 0 ? 9.99 : 0;
        const taxes = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + taxes;
        
        setCart({
          items: updatedItems,
          summary: {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            taxes: taxes.toFixed(2),
            total: total.toFixed(2),
            itemCount: updatedItems.reduce((acc, item) => acc + item.quantity, 0)
          }
        });
        
        toast({
          title: "Producto eliminado",
          description: "El producto fue eliminado del carrito local",
        });
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto del carrito",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // Intentar usar la API
      try {
        const response = await apiRequest('DELETE', '/api/cart', undefined, {
          headers: {
            'X-Session-ID': sessionId
          }
        });
        
        const data = await response.json();
        setCart(data);
      } catch (apiError) {
        console.error('Error calling API, clearing cart locally:', apiError);
        
        // Si la API falla, limpiamos el carrito localmente
        setCart({ 
          items: [], 
          summary: { subtotal: '0.00', shipping: '0.00', taxes: '0.00', total: '0.00', itemCount: 0 } 
        });
        
        toast({
          title: "Carrito vacío",
          description: "El carrito ha sido vaciado localmente",
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      sessionId,
      setSessionId,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      isLoading,
      isError
    }}>
      {children}
    </CartContext.Provider>
  );
};
