import { db } from "./db";
import { categories, products, productStatusEnum } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database...");
  
  // First, clear existing data (if any)
  await db.delete(products);
  await db.delete(categories);
  
  // Seed categories
  console.log("Adding categories...");
  const categoryData = [
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
  
  for (const category of categoryData) {
    await db.insert(categories).values(category);
  }
  
  // Get category IDs
  const allCategories = await db.select().from(categories);
  const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));
  
  // Seed products
  console.log("Adding products...");
  const productData = [
    {
      name: "Auriculares Premium",
      description: "Auriculares inalámbricos con cancelación de ruido y audio de alta fidelidad.",
      price: "89.99",
      comparePrice: "112.99",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e736ef1a4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      ]),
      categoryId: categoryMap.get("electronica"),
      status: "in_stock",
      rating: "4.5",
      reviewCount: 128
    },
    {
      name: "Cámara Instantánea",
      description: "Cámara instantánea de estilo retro con funciones modernas y calidad premium.",
      price: "129.99",
      imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]),
      categoryId: categoryMap.get("electronica"),
      status: "in_stock",
      rating: "4.0",
      reviewCount: 94
    },
    {
      name: "Smartwatch Pro",
      description: "Reloj inteligente con monitor de salud, GPS y batería de larga duración.",
      price: "199.99",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]),
      categoryId: categoryMap.get("electronica"),
      status: "in_stock",
      rating: "5.0",
      reviewCount: 217
    },
    {
      name: "Zapatillas Ultra",
      description: "Zapatillas deportivas con amortiguación avanzada y diseño moderno.",
      price: "84.99",
      comparePrice: "99.99",
      imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"]),
      categoryId: categoryMap.get("deporte"),
      status: "in_stock",
      rating: "3.5",
      reviewCount: 156
    }
  ];
  
  for (const product of productData) {
    await db.insert(products).values(product);
  }
  
  console.log("Database seeded successfully!");
}

// Run the seed function
seedDatabase().catch(e => {
  console.error("Error seeding database:", e);
  process.exit(1);
});