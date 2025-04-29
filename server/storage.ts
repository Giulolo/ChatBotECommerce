import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  cartItems, type CartItem, type InsertCartItem,
  categories, type Category, type InsertCategory,
  type OrderWithItems
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
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
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<OrderWithItems | undefined>;
  getOrdersByUserWithItems(userId: number): Promise<OrderWithItems[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private cart: Map<number, CartItem>;
  
  private userId: number;
  private productId: number;
  private categoryId: number;
  private orderId: number;
  private orderItemId: number;
  private cartItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.cart = new Map();
    
    this.userId = 1;
    this.productId = 1;
    this.categoryId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.cartItemId = 1;
    
    // Initialize with some sample products and categories
    this.initializeData();
  }

  private initializeData() {
    // Create categories
    const categories: InsertCategory[] = [
      {
        name: "Electrónica",
        slug: "electronica",
        description: "Productos electrónicos y gadgets",
        imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Ropa",
        slug: "ropa",
        description: "Ropa y accesorios de moda",
        imageUrl: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Hogar",
        slug: "hogar",
        description: "Productos para el hogar",
        imageUrl: "https://images.unsplash.com/photo-1512686096451-a15c19314d59?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Deporte",
        slug: "deporte",
        description: "Equipamiento deportivo",
        imageUrl: "https://images.unsplash.com/photo-1575318634028-6a0cfcb60c59?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    ];
    
    categories.forEach(cat => this.createCategory(cat));
    
    // Create products
    const products: InsertProduct[] = [
      {
        name: "Auriculares Premium",
        description: "Auriculares inalámbricos con cancelación de ruido y audio de alta fidelidad.",
        price: "89.99",
        comparePrice: "112.99",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1546435770-a3e736ef1a4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        category: "Electrónica",
        status: "in_stock"
      },
      {
        name: "Cámara Instantánea",
        description: "Cámara instantánea de estilo retro con funciones modernas y calidad premium.",
        price: "129.99",
        imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
        category: "Electrónica",
        status: "in_stock"
      },
      {
        name: "Smartwatch Pro",
        description: "Reloj inteligente con monitor de salud, GPS y batería de larga duración.",
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
        category: "Electrónica",
        status: "in_stock"
      },
      {
        name: "Zapatillas Ultra",
        description: "Zapatillas deportivas con amortiguación avanzada y diseño moderno.",
        price: "84.99",
        comparePrice: "99.99",
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
        category: "Deporte",
        status: "in_stock"
      }
    ];
    
    // Add extra product properties
    const productExtras = [
      { rating: 4.5, reviewCount: 128 },
      { rating: 4.0, reviewCount: 94 },
      { rating: 5.0, reviewCount: 217 },
      { rating: 3.5, reviewCount: 156 }
    ];
    
    products.forEach((prod, index) => {
      const product = this.createProduct(prod);
      const extras = productExtras[index];
      
      // Update with ratings
      const updatedProduct: Product = {
        ...product,
        rating: extras.rating,
        reviewCount: extras.reviewCount
      };
      
      this.products.set(product.id, updatedProduct);
    });
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // PRODUCT METHODS
  async getProducts(limit?: number): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    return limit ? allProducts.slice(0, limit) : allProducts;
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    
    const product: Product = {
      ...insertProduct,
      id,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    };
    
    this.products.set(id, product);
    return product;
  }
  
  // CATEGORY METHODS
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      category => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // CART METHODS
  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cart.values()).filter(
      item => item.sessionId === sessionId
    );
  }
  
  async getCartItemWithProduct(id: number): Promise<CartItem & { product: Product } | undefined> {
    const cartItem = this.cart.get(id);
    if (!cartItem) return undefined;
    
    const product = this.products.get(cartItem.productId);
    if (!product) return undefined;
    
    return { ...cartItem, product };
  }
  
  async getCartItemsBySessionWithProduct(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const cartItems = await this.getCartItemsBySession(sessionId);
    return cartItems.reduce<(CartItem & { product: Product })[]>((acc, item) => {
      const product = this.products.get(item.productId);
      if (product) {
        acc.push({ ...item, product });
      }
      return acc;
    }, []);
  }
  
  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the product is already in the cart
    const existingCartItem = Array.from(this.cart.values()).find(
      item => 
        item.sessionId === insertCartItem.sessionId && 
        item.productId === insertCartItem.productId &&
        item.color === insertCartItem.color &&
        item.size === insertCartItem.size
    );
    
    if (existingCartItem) {
      // Update quantity of existing item
      const updatedQuantity = existingCartItem.quantity + (insertCartItem.quantity || 1);
      return this.updateCartItem(existingCartItem.id, updatedQuantity) as Promise<CartItem>;
    }
    
    // Add new item to cart
    const id = this.cartItemId++;
    const now = new Date();
    
    const cartItem: CartItem = {
      ...insertCartItem,
      id,
      createdAt: now,
      updatedAt: now,
      quantity: insertCartItem.quantity || 1
    };
    
    this.cart.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cart.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem: CartItem = {
      ...cartItem,
      quantity,
      updatedAt: new Date()
    };
    
    this.cart.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cart.delete(id);
  }
  
  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = await this.getCartItemsBySession(sessionId);
    
    cartItems.forEach(item => {
      this.cart.delete(item.id);
    });
    
    return true;
  }
  
  // ORDER METHODS
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.orders.set(id, order);
    
    // Add order items
    items.forEach(item => {
      const orderItemId = this.orderItemId++;
      const orderItem: OrderItem = {
        ...item,
        id: orderItemId,
        orderId: id
      };
      
      this.orderItems.set(orderItemId, orderItem);
    });
    
    return order;
  }
  
  async getOrders(userId?: number): Promise<Order[]> {
    const allOrders = Array.from(this.orders.values());
    
    if (userId) {
      return allOrders.filter(order => order.userId === userId);
    }
    
    return allOrders;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      order => order.orderNumber === orderNumber
    );
  }
  
  async getOrderWithItems(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = Array.from(this.orderItems.values()).filter(
      item => item.orderId === id
    );
    
    return { ...order, items };
  }
  
  async getOrdersByUserWithItems(userId: number): Promise<OrderWithItems[]> {
    const orders = await this.getOrders(userId);
    
    return Promise.all(
      orders.map(async order => {
        const orderWithItems = await this.getOrderWithItems(order.id);
        return orderWithItems as OrderWithItems;
      })
    );
  }
}

// Create a new DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getProducts(limit?: number): Promise<Product[]> {
    let query = db.select().from(products);
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    const categoryObj = await this.getCategoryBySlug(category);
    if (!categoryObj) return [];
    
    return db.select()
      .from(products)
      .where(eq(products.categoryId, categoryObj.id));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select()
      .from(products)
      .where(eq(products.id, id));
      
    return product || undefined;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
      
    return product;
  }
  
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select()
      .from(categories)
      .where(eq(categories.id, id));
      
    return category || undefined;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select()
      .from(categories)
      .where(eq(categories.slug, slug));
      
    return category || undefined;
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
      
    return category;
  }
  
  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    return db.select()
      .from(cartItems)
      .where(eq(cartItems.sessionId, sessionId));
  }
  
  async getCartItemWithProduct(id: number): Promise<CartItem & { product: Product } | undefined> {
    const cartItem = await db.select()
      .from(cartItems)
      .where(eq(cartItems.id, id))
      .limit(1);
      
    if (!cartItem.length) return undefined;
    
    const [product] = await db.select()
      .from(products)
      .where(eq(products.id, cartItem[0].productId));
      
    if (!product) return undefined;
    
    return { ...cartItem[0], product };
  }
  
  async getCartItemsBySessionWithProduct(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = await this.getCartItemsBySession(sessionId);
    const result: (CartItem & { product: Product })[] = [];
    
    for (const item of items) {
      const [product] = await db.select()
        .from(products)
        .where(eq(products.id, item.productId));
        
      if (product) {
        result.push({ ...item, product });
      }
    }
    
    return result;
  }
  
  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db
      .insert(cartItems)
      .values(insertCartItem)
      .returning();
      
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedCartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
      
    return updatedCartItem || undefined;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    await db
      .delete(cartItems)
      .where(eq(cartItems.id, id));
      
    return true;
  }
  
  async clearCart(sessionId: string): Promise<boolean> {
    await db
      .delete(cartItems)
      .where(eq(cartItems.sessionId, sessionId));
      
    return true;
  }
  
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // This should be in a transaction to ensure data integrity
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
      
    for (const item of items) {
      await db
        .insert(orderItems)
        .values({ ...item, orderId: order.id });
    }
    
    return order;
  }
  
  async getOrders(userId?: number): Promise<Order[]> {
    if (userId) {
      return db.select()
        .from(orders)
        .where(eq(orders.userId, userId));
    }
    
    return db.select().from(orders);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, id));
      
    return order || undefined;
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));
      
    return order || undefined;
  }
  
  async getOrderWithItems(id: number): Promise<OrderWithItems | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
      
    return { ...order, items };
  }
  
  async getOrdersByUserWithItems(userId: number): Promise<OrderWithItems[]> {
    const userOrders = await this.getOrders(userId);
    const result: OrderWithItems[] = [];
    
    for (const order of userOrders) {
      const items = await db.select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
        
      result.push({ ...order, items });
    }
    
    return result;
  }
}

export const storage = new DatabaseStorage();
