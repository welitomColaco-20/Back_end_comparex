const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  affiliate_link: String,
  rating: Number
});

const Product = mongoose.model("Product", ProductSchema);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
