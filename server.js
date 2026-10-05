import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const demoProducts = [
  { id: "p1", name: "Aero Wireless Headphones", category: "Audio", price: 2499, rating: 4.8, emoji: "🎧", description: "Comfortable wireless headphones with deep bass and long battery life." },
  { id: "p2", name: "Nova Smart Watch", category: "Wearables", price: 3299, rating: 4.7, emoji: "⌚", description: "A lightweight smart watch for everyday activity and notifications." },
  { id: "p3", name: "Pulse Mechanical Keyboard", category: "Computers", price: 2899, rating: 4.6, emoji: "⌨️", description: "Compact mechanical keyboard with a clean, responsive typing feel." },
  { id: "p4", name: "Orbit Wireless Mouse", category: "Computers", price: 1299, rating: 4.5, emoji: "🖱️", description: "Ergonomic wireless mouse designed for study, work and gaming." },
  { id: "p5", name: "Pixel USB-C Hub", category: "Accessories", price: 1799, rating: 4.4, emoji: "🔌", description: "Multi-port USB-C hub for laptops, displays and everyday accessories." },
  { id: "p6", name: "Echo Bluetooth Speaker", category: "Audio", price: 1999, rating: 4.7, emoji: "🔊", description: "Portable speaker with clear sound and a travel-friendly design." },
  { id: "p7", name: "Flux Laptop Stand", category: "Accessories", price: 1499, rating: 4.6, emoji: "💻", description: "Foldable laptop stand that improves desk comfort and posture." },
  { id: "p8", name: "Glow Desk Lamp", category: "Home", price: 999, rating: 4.3, emoji: "💡", description: "Minimal LED desk lamp with adjustable brightness for focused work." }
];

let Product = null;
if (process.env.MONGODB_URI) {
  const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    rating: Number,
    emoji: String,
    description: String
  });
  Product = mongoose.model("Product", productSchema);
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed; demo mode will be used.", err.message));
}

app.get("/", (_req, res) => {
  res.json({ name: "ShopSphere API", status: "running", version: "1.0.0" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: Product ? "mongodb-configured" : "demo-data" });
});

app.get("/api/products", async (req, res) => {
  try {
    const { search = "", category = "All" } = req.query;
    let products = Product && mongoose.connection.readyState === 1
      ? await Product.find().lean()
      : demoProducts;

    const q = String(search).trim().toLowerCase();
    if (q) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (category !== "All") {
      products = products.filter(p => p.category === category);
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Unable to load products." });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    let product = null;
    if (Product && mongoose.connection.readyState === 1) {
      product = await Product.findById(req.params.id).lean();
    } else {
      product = demoProducts.find(p => p.id === req.params.id);
    }
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found." });
  }
});

app.get("/api/categories", async (_req, res) => {
  const products = Product && mongoose.connection.readyState === 1
    ? await Product.find({}, "category").lean()
    : demoProducts;
  const categories = ["All", ...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.listen(PORT, () => console.log(`ShopSphere API running on port ${PORT}`));
