import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import CartPopup from '../../cart/components/CartPopup';

export const ChatbotContainer: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    input,
    setInput,
    cart,
    setCart,
    // analytics,
    messagesEndRef,
    handleSendMessage,
    addToCart,
    handleCheckout
  } = useChatbot();

  return (
    <div className="relative">
      {/* Chatbot toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      <CartPopup 
        cart={cart} 
        setCart={setCart} 
        handleCheckout={handleCheckout} 
      />
      
      {/* Chatbot window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-primary">
          <div className="flex justify-between items-center p-4 border-b border-back-secondary">
            <h3 className="font-bold text-title text-xl">Asistente de Compras</h3>
          </div>
          
          {/* Area de mensaje */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <ChatMessage 
                key={message.id}
                message={message}
                addToCart={addToCart}
                setMessages={setMessages}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Area de Input */}
          <ChatInput
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
      
    </div>
  );
};

export default ChatbotContainer;