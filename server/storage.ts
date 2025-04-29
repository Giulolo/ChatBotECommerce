import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  cartItems, type CartItem, type InsertCartItem,
  categories, type Category, type InsertCategory,
  type OrderWithItems
} from "@shared/schema";

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

export const storage = new MemStorage();
