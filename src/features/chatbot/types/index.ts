export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  products?: Product[];
}

export interface ChatbotAnalytics {
  interactions: number;
  productRecommendations: number;
  addToCartActions: number;
  inquiries: Record<string, number>;
  sessionDuration: number;
}