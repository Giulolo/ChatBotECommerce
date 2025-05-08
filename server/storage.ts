import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  cartItems, type CartItem, type InsertCartItem,
  invoices, type Invoice, type InsertInvoice,
  type OrderWithItems
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(limit?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItemsBySession(sessionId: string): Promise<CartItem[]>;
  getCartItemWithProduct(id: number): Promise<CartItem & { product: Product } | undefined>;
  getCartItemsBySessionWithProduct(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<OrderWithItems | undefined>;
  getOrdersByUserWithItems(userId: number): Promise<OrderWithItems[]>;
  
  // Invoices
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByOrderId(orderId: number): Promise<Invoice | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // PRODUCT METHODS
  async getProducts(limit?: number): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }
  
  // CART METHODS
  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    return await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.sessionId, sessionId));
  }
  
  async getCartItemWithProduct(id: number): Promise<CartItem & { product: Product } | undefined> {
    const [result] = await db
      .select({
        cartItem: cartItems,
        product: products,
      })
      .from(cartItems)
      .where(eq(cartItems.id, id))
      .innerJoin(products, eq(cartItems.productId, products.id));

    if (!result) return undefined;
    return { ...result.cartItem, product: result.product };
  }
  
  async getCartItemsBySessionWithProduct(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const results = await db
      .select({
        cartItem: cartItems,
        product: products,
      })
      .from(cartItems)
      .where(eq(cartItems.sessionId, sessionId))
      .innerJoin(products, eq(cartItems.productId, products.id));

    return results.map(result => ({ ...result.cartItem, product: result.product }));
  }
  
  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the product is already in the cart for this session
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.sessionId, insertCartItem.sessionId || ''),
          eq(cartItems.productId, insertCartItem.productId)
        )
      );
    
    if (existingItem) {
      // Update quantity of existing item
      const updatedQuantity = existingItem.quantity + (insertCartItem.quantity || 1);
      return this.updateCartItem(existingItem.id, updatedQuantity) as Promise<CartItem>;
    }
    
    // Add new item to cart
    const [cartItem] = await db
      .insert(cartItems)
      .values(insertCartItem)
      .returning();
    
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    
    return cartItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(eq(cartItems.id, id));
    
    return result.rowCount > 0;
  }
  
  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(eq(cartItems.sessionId, sessionId));
    
    return true;
  }
  
  // ORDER METHODS
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Begin transaction
    return await db.transaction(async (tx) => {
      // Create order
      const [order] = await tx
        .insert(orders)
        .values(insertOrder)
        .returning();
      
      // Create order items
      if (items.length > 0) {
        await tx
          .insert(orderItems)
          .values(items.map(item => ({ ...item, orderId: order.id })));
      }
      
      return order;
    });
  }
  
  async getOrders(userId?: number): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId));
    }
    
    return await query.orderBy(desc(orders.createdAt));
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    
    return order;
  }
  
  async getOrderWithItems(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    
    if (!order) return undefined;
    
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    
    return { ...order, items };
  }
  
  async getOrdersByUserWithItems(userId: number): Promise<OrderWithItems[]> {
    const userOrders = await this.getOrders(userId);
    const result: OrderWithItems[] = [];
    
    for (const order of userOrders) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      
      result.push({ ...order, items });
    }
    
    return result;
  }
  
  // INVOICE METHODS
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();
    
    return invoice;
  }
  
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));
    
    return invoice;
  }
  
  async getInvoiceByOrderId(orderId: number): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, orderId));
    
    return invoice;
  }
}

export const storage = new DatabaseStorage();