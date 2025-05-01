import React from 'react';
import { Message, Product } from '../types';

interface ChatMessageProps {
  message: Message;
  addToCart: (product: Product) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  addToCart,
  setMessages
}) => {
  // Function to generate a ID unico
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  return (
    <div 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-3/4 p-3 rounded-lg ${
          message.sender === 'user' 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p>{message.text}</p>
        
        {/* Aparezca recomendacion del producto si hay */}
        {message.products && message.products.length > 0 && (
          <div className="mt-2 grid grid-cols-1 gap-2">
            {message.products.map(product => (
              <div key={product.id} className="flex bg-title p-2 rounded shadow-sm">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="min-w-16 min-h-16 max-w-20 max-h-20 object-cover rounded"
                />
                <div className="ml-2 flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  <button 
                    className="mt-1 text-xs bg-secondary text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => {
                      addToCart(product);
                      setMessages(prev => [
                        ...prev, 
                        {
                          id: generateId(),
                          text: `¡He agregado ${product.name} a tu carrito! Puedes ver tu carrito haciendo clic en el botón de carrito.`,
                          sender: 'bot'
                        }
                      ]);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};