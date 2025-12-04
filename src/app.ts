import { Router } from "express";
import authRoutes from "./routes/authRoutes";
import clientesRoutes from "./routes/clientesRoutes";
import emprestimosRoutes from "./routes/emprestimosRoutes";
import parcelasRoutes from "./routes/parcelasRoutes";
import cobrancasRoutes from "./routes/cobrancasRoutes";
import pdfRoutes from "./routes/pdfRoutes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/clientes", clientesRoutes);
router.use("/emprestimos", emprestimosRoutes);
router.use("/parcelas", parcelasRoutes);
router.use("/cobrancas", cobrancasRoutes);
router.use("/pdf", pdfRoutes);
