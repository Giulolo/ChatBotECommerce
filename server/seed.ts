import { db } from "./db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database...");
  
  // First, clear existing data (if any)
  await db.delete(products);
  
  // Seed products
  console.log("Adding products...");
  const productData = [
    {
      name: "Velas Aromáticas",
      description: "Velas aromáticas hechas a mano con ingredientes naturales y fragancias duraderas.",
      price: "19.99",
      image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Cojines Decorativos",
      description: "Cojines decorativos de alta calidad con diseños exclusivos para embellecer tu hogar.",
      price: "24.99",
      image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Jarrón Artesanal",
      description: "Jarrón artesanal hecho a mano por artesanos locales con técnicas tradicionales.",
      price: "49.99",
      image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Manta Tejida",
      description: "Manta tejida a mano con lana orgánica, perfecta para esas noches frías.",
      price: "59.99",
      image: "https://images.unsplash.com/photo-1580297241242-39af6d010fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Difusor de Aromas",
      description: "Difusor ultrasónico de aromas con aceites esenciales para crear ambientes relajantes.",
      price: "39.99",
      image: "https://images.unsplash.com/photo-1602209447085-d1d96d59d5d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Lámpara de Mesa",
      description: "Lámpara de mesa de diseño moderno con base de cerámica y pantalla de lino.",
      price: "69.99",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Auriculares Premium",
      description: "Auriculares inalámbricos con cancelación de ruido y audio de alta fidelidad.",
      price: "89.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Cámara Instantánea",
      description: "Cámara instantánea de estilo retro con funciones modernas y calidad premium.",
      price: "129.99",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Zapatillas Ultra",
      description: "Zapatillas deportivas con amortiguación avanzada y diseño moderno.",
      price: "84.99",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
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