import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { 
  insertProductSchema, 
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertUserSchema,
  orders
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API routes with /api prefix
  
  // PRODUCTS
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const results = await db.execute('SELECT * FROM products');
      console.log('✅ Products obtenidos:', results.rows.length);
      res.json(results.rows);
    } catch (error) {
      console.error('❌ Error al obtener products:', error);
      res.status(500).json({ message: "Error al obtener productos" });
    }
  });
  
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });
  
  // CART
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from cookie or create one
      let sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const cart = await storage.getCartItemsBySessionWithProduct(sessionId);
      
      // Calculate totals
      let subtotal = 0;
      cart.forEach(item => {
        const itemPrice = parseFloat(item.product.price.toString());
        subtotal += itemPrice * item.quantity;
      });
      
      const shipping = cart.length > 0 ? 9.99 : 0;
      const taxes = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + taxes;
      
      res.json({
        items: cart,
        summary: {
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
          itemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  });
  
  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from header or create one
      let sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Get user ID if authenticated
      const userId = req.isAuthenticated() ? (req.user as Express.User).id : undefined;
      
      // Validate request body
      const validationResult = insertCartItemSchema
        .safeParse({ ...req.body, sessionId, userId });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid cart item data",
          errors: validationResult.error.errors 
        });
      }
      
      // Add to cart
      const cartItem = await storage.addToCart(validationResult.data);
      
      // Return the cart with product information
      const updatedCart = await storage.getCartItemsBySessionWithProduct(sessionId);
      
      // Calculate totals
      let subtotal = 0;
      updatedCart.forEach(item => {
        const itemPrice = parseFloat(item.product.price.toString());
        subtotal += itemPrice * item.quantity;
      });
      
      const shipping = updatedCart.length > 0 ? 9.99 : 0;
      const taxes = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + taxes;
      
      res.status(201).json({
        items: updatedCart,
        summary: {
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
          itemCount: updatedCart.reduce((acc, item) => acc + item.quantity, 0)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });
  
  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Get session ID from cart item
      const sessionId = cartItem.sessionId as string;
      
      // Return the updated cart with product information
      const updatedCart = await storage.getCartItemsBySessionWithProduct(sessionId);
      
      // Calculate totals
      let subtotal = 0;
      updatedCart.forEach(item => {
        const itemPrice = parseFloat(item.product.price.toString());
        subtotal += itemPrice * item.quantity;
      });
      
      const shipping = updatedCart.length > 0 ? 9.99 : 0;
      const taxes = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + taxes;
      
      res.json({
        items: updatedCart,
        summary: {
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
          itemCount: updatedCart.reduce((acc, item) => acc + item.quantity, 0)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });
  
  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      // First get the cart item to extract the sessionId
      const cartItem = await storage.getCartItemWithProduct(id);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      const sessionId = cartItem.sessionId as string;
      
      // Remove the item from cart
      const removed = await storage.removeCartItem(id);
      
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Return the updated cart with product information
      const updatedCart = await storage.getCartItemsBySessionWithProduct(sessionId);
      
      // Calculate totals
      let subtotal = 0;
      updatedCart.forEach(item => {
        const itemPrice = parseFloat(item.product.price.toString());
        subtotal += itemPrice * item.quantity;
      });
      
      const shipping = updatedCart.length > 0 ? 9.99 : 0;
      const taxes = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + taxes;
      
      res.json({
        items: updatedCart,
        summary: {
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
          itemCount: updatedCart.reduce((acc, item) => acc + item.quantity, 0)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error removing cart item" });
    }
  });
  
  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from header
      let sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Clear cart
      await storage.clearCart(sessionId);
      
      res.json({
        items: [],
        summary: {
          subtotal: "0.00",
          shipping: "0.00",
          taxes: "0.00",
          total: "0.00",
          itemCount: 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });
  
  // ORDERS
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // Get session ID from header
      let sessionId = req.headers["x-session-id"] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItemsBySessionWithProduct(sessionId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total
      let total = 0;
      cartItems.forEach(item => {
        const itemPrice = parseFloat(item.product.price.toString());
        total += itemPrice * item.quantity;
      });
      
      // Get user ID if authenticated
      const userId = req.isAuthenticated() ? (req.user as Express.User).id : undefined;
      
      // Create order
      const order = await storage.createOrder(
        {
          userId: userId,
          total: total.toString(),
          status: "pending",
          paymentProof: null
        },
        // Create order items
        cartItems.map(item => ({
          orderId: 0, // This will be set by storage
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price.toString()
        }))
      );
      
      // Clear cart
      await storage.clearCart(sessionId);
      
      // Return order with items
      const orderWithItems = await storage.getOrderWithItems(order.id);
      
      res.status(201).json(orderWithItems);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });
  
  // Upload payment proof
  app.put("/api/orders/:id/payment-proof", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Please login to update order" });
      }
      
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Ensure user can only update their own orders
      if (order.userId !== (req.user as Express.User).id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Validate request body
      const schema = z.object({
        paymentProof: z.string().min(1)
      });
      
      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid payment proof data",
          errors: validationResult.error.errors 
        });
      }
      
      // Update order
      const updatedOrder = await db
        .update(orders)
        .set({ 
          paymentProof: validationResult.data.paymentProof,
          status: "validated" // Automatically update status when proof is provided
        })
        .where(eq(orders.id, id))
        .returning();
      
      // Return order with items
      const orderWithItems = await storage.getOrderWithItems(id);
      
      res.json(orderWithItems);
    } catch (error) {
      console.error("Error updating payment proof:", error);
      res.status(500).json({ message: "Error updating payment proof" });
    }
  });
  
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Please login to view orders" });
      }
      
      const userId = (req.user as Express.User).id;
      
      // Get orders for user with items
      const userOrders = await storage.getOrdersByUserWithItems(userId);
      
      res.json(userOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Please login to view order details" });
      }
      
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrderWithItems(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Ensure user can only see their own orders
      if (order.userId !== (req.user as Express.User).id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
