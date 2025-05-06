import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Product } from '../../chatbot/types';

interface CartPopupProps {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  handleCheckout: () => void;
}

export const CartPopup: React.FC<CartPopupProps> = ({ 
  cart, 
  setCart,
  handleCheckout
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  if (cart.length === 0 && isCartOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-lg shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-title">Carrito de Compra</h3>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="text-gray-500 text-center p-4 mb-4">Tu carrito está vacío</div>
          <button 
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary"
            onClick={() => setIsCartOpen(false)}
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }
  
  if (!isCartOpen) return (
    <button 
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-4 right-20 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-all"
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cart.length}
          </span>
        )}
      </div>
    </button>
  );
  
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">Carrito de Compra</h3>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto mb-4">
          {cart.map(product => (
            <div key={`cart-${product.id}`} className="flex items-center border-b border-gray-200 py-2">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-3 flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
              <button 
                className="text-gray-500 hover:text-red-500"
                onClick={() => {
                  setCart(prev => prev.filter(item => item.id !== product.id));
                }}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between font-bold mb-4 pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            onClick={() => setIsCartOpen(false)}
          >
            Seguir Comprando
          </button>
          <button 
            className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-secondary"
            onClick={() => {
              handleCheckout();
              setIsCartOpen(false);
            }}
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;