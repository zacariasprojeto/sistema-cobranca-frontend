import { Router } from "express";
import * as controller from "../controllers/pdfController";

const router = Router();

router.get("/:id", controller.gerarPDF);

export default router;
