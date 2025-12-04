import { Router } from "express";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";
import * as controller from "../controllers/cobrancasController";

const router = Router();

router.post("/manual/:cliente_id", auth, permitir("enviar_cobrancas"), controller.cobrancaManual);
router.post("/automatico", controller.cobrancaAutomatica); // usado pelo cron job

export default router;
