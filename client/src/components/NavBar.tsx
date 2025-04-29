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
      <nav className="bg-white sticky top-0 z-50 pt-4 pb-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <span className="font-bree-serif text-2xl mr-2">logo</span>
                <div className="border border-gray-300 rounded p-1 w-6 h-6 flex items-center justify-center">
                  <i className="fas fa-bars text-xs"></i>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8 mx-auto">
              <Link href="/" className="font-bree-serif text-xl text-[#CB9C5E] hover:text-amber-700 transition-colors">
                Home
              </Link>
              <Link href="/#productos" className="font-bree-serif text-xl text-[#CB9C5E] hover:text-amber-700 transition-colors">
                Productos
              </Link>
              <Link href="/#contacto" className="font-bree-serif text-xl text-[#CB9C5E] hover:text-amber-700 transition-colors">
                Contacto
              </Link>
            </div>
            
            <div className="flex items-center">
              <div className="relative hidden md:block mr-4">
                <Input 
                  type="text" 
                  placeholder="" 
                  className="w-64 px-4 py-2 rounded-full bg-pink-100 border-0 focus:outline-none focus:ring-1 focus:ring-pink-300"
                />
              </div>
              
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-orange-800"></i>
              </div>
              
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden ml-4 p-2 text-foreground hover:text-primary transition-colors"
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
              <Link href="/" className="block px-3 py-2 rounded-md hover:bg-pink-50 font-bree-serif text-lg text-[#CB9C5E]">
                Home
              </Link>
              <Link href="/#productos" className="block px-3 py-2 rounded-md hover:bg-pink-50 font-bree-serif text-lg text-[#CB9C5E]">
                Productos
              </Link>
              <Link href="/#contacto" className="block px-3 py-2 rounded-md hover:bg-pink-50 font-bree-serif text-lg text-[#CB9C5E]">
                Contacto
              </Link>
              <div className="relative mt-3">
                <Input 
                  type="text" 
                  placeholder="" 
                  className="w-full px-4 py-2 rounded-full bg-pink-100 border-0 focus:outline-none focus:ring-1 focus:ring-pink-300"
                />
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
