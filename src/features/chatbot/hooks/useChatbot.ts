import { useState, useEffect, useRef } from 'react';
import { Message, Product, ChatbotAnalytics } from '../types';
import { products } from '../data/products';

// Function to generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      text: "¡Hola! Soy el asistente de compras virtual. ¿En qué puedo ayudarte hoy?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<ChatbotAnalytics>({
    interactions: 0,
    productRecommendations: 0,
    addToCartActions: 0,
    inquiries: {},
    sessionDuration: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track el tiempo cuando able el chat
  useEffect(() => {
    if (isOpen && !sessionStartTime) {
      setSessionStartTime(Date.now());
    } else if (!isOpen && sessionStartTime) {
      // Update session duration when chat closes
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      setAnalytics(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + duration
      }));
      setSessionStartTime(null);
    }
  }, [isOpen, sessionStartTime]);

  // Categorizar las consultas de los usuarios para su análisis
  const categorizeInquiry = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('cuánto')) {
      return 'price';
    } else if (lowerMsg.includes('envío') || lowerMsg.includes('entrega') || lowerMsg.includes('delivery')) {
      return 'shipping';
    } else if (lowerMsg.includes('características') || lowerMsg.includes('especificaciones')) {
      return 'specifications';
    } else if (lowerMsg.includes('disponible') || lowerMsg.includes('stock') || lowerMsg.includes('hay')) {
      return 'availability';
    } else {
      return 'general';
    }
  };

  // Procesar la entrada del usuario
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Update 
    setAnalytics(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      inquiries: {
        ...prev.inquiries,
        [categorizeInquiry(input)]: (prev.inquiries[categorizeInquiry(input)] || 0) + 1
      }
    }));

    // Procesar mensaje y responder
    setTimeout(() => {
      respondToMessage(input);
    }, 500);
  };

  // Generar respuesta de bot
  const respondToMessage = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
  // keyword para buscar producto
  const productKeywords = {
    'laptop': ['laptop', 'computadora', 'computer'],
    'smartphone': ['smartphone', 'phone', 'celular', 'telefono', 'mobile'],
    'iphone' : ['iphone', 'apple'],
    'android' : ['android'],
    'headphones': ['audífonos', 'audifonos', 'headphones', 'auriculares'],
    'watch': ['reloj', 'watch', 'smartwatch'],
    'tablet': ['tablet', 'tableta']
  };

  // Si usuario quiere ver todo producto
  if (
    lowerInput.includes('todo') || 
    lowerInput.includes('todos') || 
    lowerInput.includes('productos') || 
    lowerInput.includes('catalogo') || 
    lowerInput.includes('catálogo')
  ) {
    const botResponse: Message = {
      id: generateId(),
      text: "Aquí están todos nuestros productos disponibles:",
      sender: 'bot',
      products: products
    };
    
    setMessages(prev => [...prev, botResponse]);
    
    // Update analysis
    setAnalytics(prev => ({
      ...prev,
      productRecommendations: prev.productRecommendations + 1
    }));
    
    return;
  }

  // Comprobar si el usuario está preguntando sobre un tipo de producto específico
  let foundProducts: Product[] = [];
  
  Object.entries(productKeywords).forEach(([productType, keywords]) => {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      const matchedProducts = products.filter(product => 
        product.name.toLowerCase().includes(productType)
      );
      // solo un catologo
      // foundProducts = matchedProducts;

      // multiple catalogo
      foundProducts = [...foundProducts, ...matchedProducts];
    }
  });

  // Si especifico producto encontrado
  if (foundProducts.length > 0) {
    const botResponse: Message = {
      id: generateId(),
      text: foundProducts.length === 1 
        ? `Aquí tienes información sobre ${foundProducts[0].name}: ${foundProducts[0].description}. El precio es $${foundProducts[0].price}. ¿Te gustaría agregarlo al carrito?`
        : `Encontré los siguientes productos: ${foundProducts.map(p => p.name).join(', ')}`,
      sender: 'bot',
      products: foundProducts
    };
    
    setMessages(prev => [...prev, botResponse]);
    
    setAnalytics(prev => ({
      ...prev,
      productRecommendations: prev.productRecommendations + 1
    }));
    
    return;
  }
    
    // Verifica si la usuario quiere agregar al carrito.
    if (lowerInput.includes('agregar') || lowerInput.includes('añadir') || lowerInput.includes('comprar')) {
      for (const product of products) {
        if (lowerInput.includes(product.name.toLowerCase())) {
          addToCart(product);
          const botResponse: Message = {
            id: generateId(),
            text: `¡He agregado ${product.name} a tu carrito! Puedes ver tu carrito haciendo clic en el botón de carrito.`,
            sender: 'bot'
          };
          
          setMessages(prev => [...prev, botResponse]);
          return;
        }
      }
    }
    
    // Verifica si la usuario quiere ver al carrito.
    if (lowerInput.includes('carrito') || lowerInput.includes('cart') || lowerInput.includes('compras')) {
      if (cart.length === 0) {
        const botResponse: Message = {
          id: generateId(),
          text: "Tu carrito está vacío. ¿Te gustaría ver nuestros productos?",
          sender: 'bot'
        };
        
        setMessages(prev => [...prev, botResponse]);
      } else {
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        const botResponse: Message = {
          id: generateId(),
          text: `Tu carrito contiene ${cart.length} producto(s) con un total de $${totalPrice.toFixed(2)}. Puedes verlo haciendo clic en el botón de carrito.`,
          sender: 'bot'
        };
        
        setMessages(prev => [...prev, botResponse]);
      }
      return;
    }
    
    // Default respuestas si no se detectó nada específico
    if (foundProducts.length === 0) {
      const botResponse: Message = {
        id: generateId(),
        text: "Lo siento no entendi, porfavor especificar tu pregunta, puedo ayudarte a encontrar productos, añadirlos al carrito y responder preguntas sobre nuestra tienda. ¿Qué te gustaría hacer?",
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }
  };

  // agregar al cart
  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    
    setAnalytics(prev => ({
      ...prev,
      addToCartActions: prev.addToCartActions + 1
    }));
  };
  
  // Checkout funcion
  const handleCheckout = () => {
    setMessages(prev => [
      ...prev, 
      {
        id: generateId(),
        text: "¡Gracias por tu compra! Tu pedido ha sido procesado. Recibirás un correo de confirmación en breve.",
        sender: 'bot'
      }
    ]);
    setCart([]);
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    input,
    setInput,
    cart,
    setCart,
    analytics,
    messagesEndRef,
    handleSendMessage,
    addToCart,
    handleCheckout
  };
};