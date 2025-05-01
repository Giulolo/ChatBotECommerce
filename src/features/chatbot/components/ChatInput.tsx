import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  handleSendMessage 
}) => {
  return (
    <div className="p-4 border-t">
      <div className="flex">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-back-secondary text-gray-500"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;