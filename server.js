import express from "express";
import publicRoutes from "./routes/public.js";
const app = express();

app.use(express.json());
app.use('/public', publicRoutes);

app.get("/", (req, res) => {
  res.send("Servidor rodando");
  });

  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000🚀");
    });
