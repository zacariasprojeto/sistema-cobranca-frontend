import { Router } from "express";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";
import * as controller from "../controllers/clientesController";

const router = Router();

router.get("/", auth, permitir("ver_clientes"), controller.listarClientes);
router.post("/", auth, permitir("editar_dados"), controller.criarCliente);

export default router;
