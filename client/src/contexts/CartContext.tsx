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
  const [cart, setCart] = useState<Cart>({ 
    items: [], 
    summary: { subtotal: '0', shipping: '0', taxes: '0', total: '0', itemCount: 0 } 
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

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
      const response = await fetch('/api/cart', {
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
      const response = await apiRequest('POST', '/api/cart', {
        ...item,
        sessionId
      });
      
      const data = await response.json();
      setCart(data);
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
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      
      const data = await response.json();
      setCart(data);
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
      const response = await apiRequest('DELETE', `/api/cart/${id}`, undefined);
      
      const data = await response.json();
      setCart(data);
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
      const response = await apiRequest('DELETE', '/api/cart', undefined);
      
      const data = await response.json();
      setCart(data);
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
