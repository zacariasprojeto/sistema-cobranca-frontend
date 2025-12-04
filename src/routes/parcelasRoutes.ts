import { Router } from "express";
import * as controller from "../controllers/parcelasController";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";

const router = Router();

router.get("/", auth, permitir("ver_parcelas"), controller.listarParcelas);
router.put("/:id", auth, permitir("editar_dados"), controller.atualizarParcela);

export default router;
