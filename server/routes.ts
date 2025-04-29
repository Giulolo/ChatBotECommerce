import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { 
  insertProductSchema, 
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // PRODUCTS
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const products = await storage.getProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });
  
  app.get("/api/products/category/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const products = await storage.getProductsByCategory(category.name);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products by category" });
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
  
  // CATEGORIES
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
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
      
      // Validate request body
      const validationResult = insertCartItemSchema
        .omit({ userId: true })
        .safeParse({ ...req.body, sessionId });
      
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
      
      // Validate order data
      const OrderRequestSchema = z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string(),
        shippingCity: z.string(),
        shippingPostalCode: z.string(),
        shippingProvince: z.string(),
        shippingCountry: z.string(),
        paymentMethod: z.string()
      });
      
      const validationResult = OrderRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid order data",
          errors: validationResult.error.errors 
        });
      }
      
      const orderData = validationResult.data;
      
      // Calculate totals
      let subtotal = 0;
      cartItems.forEach(item => {
        const itemPrice = parseFloat(item.product.price.toString());
        subtotal += itemPrice * item.quantity;
      });
      
      const shipping = 9.99;
      const taxes = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + taxes;
      
      // Generate order number
      const orderNumber = `ORD-${nanoid(5).toUpperCase()}`;
      
      // Create order
      const order = await storage.createOrder(
        {
          orderNumber,
          userId: undefined,
          status: "pending",
          subtotal: subtotal.toString(),
          shipping: shipping.toString(),
          taxes: taxes.toString(),
          total: total.toString(),
          paymentMethod: orderData.paymentMethod,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity,
          shippingPostalCode: orderData.shippingPostalCode,
          shippingProvince: orderData.shippingProvince,
          shippingCountry: orderData.shippingCountry,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone
        },
        // Create order items
        cartItems.map(item => ({
          orderId: 0, // This will be set by storage
          productId: item.productId,
          productName: item.product.name,
          productImageUrl: item.product.imageUrl,
          price: item.product.price.toString(),
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          subtotal: (parseFloat(item.product.price.toString()) * item.quantity).toString()
        }))
      );
      
      // Clear cart
      await storage.clearCart(sessionId);
      
      // Return order with items
      const orderWithItems = await storage.getOrderWithItems(order.id);
      
      res.status(201).json(orderWithItems);
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  });
  
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      // Without authentication, we'll use email to fetch orders
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Get all orders
      const allOrders = await storage.getOrders();
      
      // Filter orders by customer email
      const customerOrders = allOrders.filter(order => order.customerEmail === email);
      
      // Get order details with items
      const ordersWithItems = await Promise.all(
        customerOrders.map(async order => {
          return await storage.getOrderWithItems(order.id);
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrderWithItems(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });
  
  app.get("/api/orders/number/:orderNumber", async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      
      const order = await storage.getOrderByNumber(orderNumber);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderWithItems = await storage.getOrderWithItems(order.id);
      
      res.json(orderWithItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
