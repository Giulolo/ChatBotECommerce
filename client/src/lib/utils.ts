import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const getOrderStatusLabel = (status: string): { label: string, color: string } => {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' };
    case 'processing':
      return { label: 'Procesando', color: 'bg-blue-100 text-blue-800' };
    case 'shipped':
      return { label: 'En camino', color: 'bg-blue-100 text-blue-800' };
    case 'delivered':
      return { label: 'Entregado', color: 'bg-green-100 text-green-800' };
    case 'cancelled':
      return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
    default:
      return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
  }
};

export function generateStarRating(rating: number): React.ReactNode[] {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Using the imported React
  
  const stars: React.ReactNode[] = [];
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(React.createElement('i', { 
      key: `full-${i}`, 
      className: "fas fa-star text-yellow-400" 
    }));
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(React.createElement('i', { 
      key: "half", 
      className: "fas fa-star-half-alt text-yellow-400" 
    }));
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(React.createElement('i', { 
      key: `empty-${i}`, 
      className: "far fa-star text-yellow-400" 
    }));
  }
  
  return stars;
}
