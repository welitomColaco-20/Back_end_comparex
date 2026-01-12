const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Erro MongoDB:", err));

// Schema e Model
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    affiliate_link: { type: String, required: true },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

// Rota teste
app.get("/", (req, res) => {
  res.send("API Busca Shop rodando 🚀");
});

// 🔍 Buscar produtos
app.get("/products", async (req, res) => {
  try {
    const search = req.query.search || "";

    const products = await Product.find({
      title: { $regex: search, $options: "i" }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// ➕ Criar produto (ADMIN)
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar produto" });
  }
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
