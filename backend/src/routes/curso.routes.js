import { Router } from "express";
import {
  crearCursoController,
  obtenerCursosController,
} from "../controllers/curso.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = Router();

// Endpoint: GET /api/cursos
router.get("/", authMiddleware, obtenerCursosController);

// Endpoint: POST /api/cursos
router.post(
  "/",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  crearCursoController,
);

export default router;
