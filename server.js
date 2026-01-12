require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ----------------- Mongo ----------------- */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Erro Mongo:", err));

/* ----------------- Schema ----------------- */
const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  affiliate_link: String,
  rating: Number
});

const Product = mongoose.model("Product", ProductSchema);

/* ----------------- Multer ----------------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ----------------- Rotas ----------------- */
app.get("/", (req, res) => {
  res.send("API Busca Shop rodando 🚀");
});

app.get("/products", async (req, res) => {
  const search = req.query.search || "";

  const products = await Product.find({
    title: { $regex: search, $options: "i" }
  });

  res.json(products);
});

/* 🔥 ROTA DE CADASTRO COM UPLOAD */
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      affiliate_link: req.body.affiliate_link,
      rating: req.body.rating,
      image: `/uploads/${req.file.filename}`
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar produto" });
  }
});

/* ----------------- Server ----------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta", PORT);
});
