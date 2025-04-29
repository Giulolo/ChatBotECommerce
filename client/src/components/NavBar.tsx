import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ShoppingCart from '@/components/ShoppingCart';
import { useCart } from '@/contexts/CartContext';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { cart } = useCart();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };
  
  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [setLocation]);
  
  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-10">
              <Link href="/" className="font-poppins font-semibold text-2xl text-accent">
                e-Commerse
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="font-poppins text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/#productos" className="font-poppins text-foreground hover:text-primary transition-colors">
                  Productos
                </Link>
                <Link href="/#contacto" className="font-poppins text-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  className="w-64 px-4 py-2 rounded-full bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="absolute right-3 top-2 text-gray-500">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              
              <button 
                onClick={toggleCart}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.summary?.itemCount || 0}
                </span>
              </button>
              
              <Link href="/orders">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="p-2 rounded-full bg-primary/10 text-foreground hover:bg-primary/20 transition-colors"
                >
                  <i className="fas fa-user"></i>
                </Button>
              </Link>
              
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 py-3 space-y-2 bg-white border-t">
              <Link href="/" className="block px-3 py-2 rounded-md hover:bg-secondary/20 font-medium">
                Home
              </Link>
              <Link href="/#productos" className="block px-3 py-2 rounded-md hover:bg-secondary/20 font-medium">
                Productos
              </Link>
              <Link href="/#contacto" className="block px-3 py-2 rounded-md hover:bg-secondary/20 font-medium">
                Contacto
              </Link>
              <div className="relative mt-3">
                <Input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  className="w-full px-4 py-2 rounded-full bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="absolute right-3 top-2 text-gray-500">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Shopping Cart Sidebar */}
      <ShoppingCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default NavBar;
