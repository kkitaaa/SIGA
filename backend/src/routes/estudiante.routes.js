import { Router } from "express";
import { registrarEstudianteController } from "../controllers/estudiante.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = Router();
router.post(
  "/",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  registrarEstudianteController,
);

export default router;
