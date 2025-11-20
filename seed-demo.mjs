import { drizzle } from "drizzle-orm/mysql2";
import { restaurants, menuItems, bookings } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

// Demo restaurant data
const demoRestaurant = {
  id: 1,
  userId: 1, // Will be created by first user login
  name: "Trattoria La Pergola",
  description: "Autentica cucina italiana con ingredienti freschi e ricette tradizionali",
  address: "Via Roma 123, Milano, Italia",
  phone: "+39 02 1234567",
  email: "info@lapergola.it",
  openingHours: JSON.stringify({
    lunedi: "12:00-15:00, 19:00-23:00",
    martedi: "12:00-15:00, 19:00-23:00",
    mercoledi: "12:00-15:00, 19:00-23:00",
    giovedi: "12:00-15:00, 19:00-23:00",
    venerdi: "12:00-15:00, 19:00-23:00",
    sabato: "12:00-15:00, 19:00-23:00",
    domenica: "12:00-15:00, 19:00-23:00"
  }),
  cuisine: "Italiana",
  logoUrl: "https://placehold.co/200x200/D97850/2D1810?text=LP"
};

// Demo menu items
const demoMenu = [
  {
    restaurantId: 1,
    name: "Bruschetta al Pomodoro",
    description: "Pane tostato con pomodori freschi, basilico e olio d'oliva",
    category: "Antipasti",
    price: 850, // €8.50
    available: true,
    allergens: JSON.stringify(["glutine"])
  },
  {
    restaurantId: 1,
    name: "Caprese",
    description: "Mozzarella di bufala, pomodori e basilico fresco",
    category: "Antipasti",
    price: 1200,
    available: true,
    allergens: JSON.stringify(["lattosio"])
  },
  {
    restaurantId: 1,
    name: "Spaghetti alla Carbonara",
    description: "Pasta fresca con guanciale, uova e pecorino romano",
    category: "Primi",
    price: 1400,
    available: true,
    allergens: JSON.stringify(["glutine", "uova", "lattosio"])
  },
  {
    restaurantId: 1,
    name: "Risotto ai Funghi Porcini",
    description: "Risotto cremoso con funghi porcini freschi",
    category: "Primi",
    price: 1600,
    available: true,
    allergens: JSON.stringify(["lattosio"])
  },
  {
    restaurantId: 1,
    name: "Ossobuco alla Milanese",
    description: "Stinco di vitello brasato con gremolata",
    category: "Secondi",
    price: 2200,
    available: true,
    allergens: JSON.stringify([])
  },
  {
    restaurantId: 1,
    name: "Tagliata di Manzo",
    description: "Manzo alla griglia con rucola e grana",
    category: "Secondi",
    price: 2400,
    available: true,
    allergens: JSON.stringify(["lattosio"])
  },
  {
    restaurantId: 1,
    name: "Tiramisù",
    description: "Classico dolce italiano con mascarpone e caffè",
    category: "Dolci",
    price: 700,
    available: true,
    allergens: JSON.stringify(["glutine", "uova", "lattosio"])
  },
  {
    restaurantId: 1,
    name: "Panna Cotta",
    description: "Dolce al cucchiaio con coulis di frutti di bosco",
    category: "Dolci",
    price: 650,
    available: true,
    allergens: JSON.stringify(["lattosio"])
  }
];

async function seed() {
  console.log("Seeding demo data...");
  
  try {
    // Insert restaurant
    await db.insert(restaurants).values(demoRestaurant).onDuplicateKeyUpdate({ set: { id: demoRestaurant.id } });
    console.log("✓ Restaurant created");
    
    // Insert menu items
    for (const item of demoMenu) {
      await db.insert(menuItems).values(item);
    }
    console.log("✓ Menu items created");
    
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
