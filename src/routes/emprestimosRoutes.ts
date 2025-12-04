import { Router } from "express";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";
import * as controller from "../controllers/emprestimosController";

const router = Router();

router.get("/", auth, permitir("ver_emprestimos"), controller.listar);
router.post("/", auth, permitir("editar_dados"), controller.criar);

export default router;
