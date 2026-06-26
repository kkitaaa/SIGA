import { Router } from "express";
import { obtenerMetricasDashboard } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 * get:
 * summary: Obtener métricas generales para la pantalla principal administrativa
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Métricas obtenidas correctamente
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * estudiantes:
 * type: integer
 * example: 120
 * funcionarios:
 * type: integer
 * example: 15
 * documentos:
 * type: integer
 * example: 45
 * pie:
 * type: integer
 * example: 30
 * 401:
 * description: No autorizado (Token faltante o inválido)
 * 403:
 * description: Acceso denegado (Rol insuficiente)
 * 500:
 * description: Error interno del servidor
 */
router.get(
  "/",
  authMiddleware,
  // Ajusta los roles según quién deba ver estas métricas
  verifyRole("Directiva", "Coordinador Administrativo"),
  obtenerMetricasDashboard,
);

export default router;
