import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { startWhatsApp } from "./config/whatsapp";
import { router } from "./app";

dotenv.config();

const app = express();

// CORS CORRIGIDO
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ROTA TESTE
app.get("/", (req, res) => {
  res.send("🚀 Backend do Sistema de Cobranças está online!");
});

// ROTAS
app.use(router);

// WHATSAPP
startWhatsApp();

// PORTA
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
