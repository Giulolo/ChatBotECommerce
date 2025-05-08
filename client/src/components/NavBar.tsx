import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ShoppingCart from '@/components/ShoppingCart';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart as ShoppingCartIcon, User, LogOut } from 'lucide-react';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { cart } = useCart();
  const { user, logoutMutation } = useAuth();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [setLocation]);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <>
      <nav className="bg-white sticky top-0 z-50 pt-4 pb-2 shadow-sm">
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
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  className="w-64 px-4 py-2 rounded-full bg-pink-100 border-0 focus:outline-none focus:ring-1 focus:ring-pink-300"
                />
              </div>
              
              {/* Cart Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCart}
                className="relative"
              >
                <ShoppingCartIcon className="h-6 w-6 text-[#CB9C5E]" />
                {cart.summary.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.summary.itemCount}
                  </span>
                )}
              </Button>
              
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback className="bg-orange-200 text-orange-800">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer w-full">
                        Mis Pedidos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-[#CB9C5E] hover:text-amber-700 hover:bg-orange-50"
                  >
                    <Link href="/auth">Iniciar Sesión</Link>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-[#CB9C5E] hover:bg-amber-700 text-white"
                  >
                    <Link href="/auth?tab=register">Registro</Link>
                  </Button>
                </div>
              )}
              
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-[#CB9C5E] hover:text-amber-700 transition-colors"
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
                  placeholder="Buscar productos..." 
                  className="w-full px-4 py-2 rounded-full bg-pink-100 border-0 focus:outline-none focus:ring-1 focus:ring-pink-300"
                />
              </div>
              {!user && (
                <div className="mt-4 flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full border-[#CB9C5E] text-[#CB9C5E]"
                  >
                    <Link href="/auth">Iniciar Sesión</Link>
                  </Button>
                  <Button 
                    variant="default" 
                    asChild 
                    className="w-full bg-[#CB9C5E] hover:bg-amber-700"
                  >
                    <Link href="/auth?tab=register">Registro</Link>
                  </Button>
                </div>
              )}
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
