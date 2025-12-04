import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { startWhatsApp } from "./config/whatsapp";
import { router } from "./app";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

startWhatsApp();

app.listen(process.env.PORT, () =>
  console.log(`🚀 Backend rodando na porta ${process.env.PORT}`)
);
