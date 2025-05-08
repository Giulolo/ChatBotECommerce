import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useCart } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import OrdersHistoryPage from "@/pages/OrdersHistoryPage";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const { setSessionId } = useCart();
  
  // Initialize session ID
  useEffect(() => {
    // Check if we have a session ID in localStorage
    let sessionId = localStorage.getItem('sessionId');
    
    // If not, create one
    if (!sessionId) {
      sessionId = nanoid();
      localStorage.setItem('sessionId', sessionId);
    }
    
    // Set it in the context
    setSessionId(sessionId);
  }, [setSessionId]);
  
  return (
    <>
      <NavBar />
      <main className="min-h-screen">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/checkout" component={CheckoutPage} />
          <ProtectedRoute path="/order-confirmation/:orderNumber" component={OrderConfirmationPage} />
          <ProtectedRoute path="/orders" component={OrdersHistoryPage} />
          <ProtectedRoute path="/orders/:id" component={OrderDetailsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
