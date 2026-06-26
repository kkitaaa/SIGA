import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  crearAsignacionPieController,
  finalizarAsignacionPieController,
  listarAsignacionesPieController,
  obtenerAsignacionPieController,
} from "../controllers/asignacion-pie.controller.js";

const router = Router();

/**
 * @swagger
 * /api/asignacion-pie:
 *   post:
 *     summary: Crear una asignacion PIE
 *     tags: [Asignacion PIE]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, crearAsignacionPieController);

/**
 * @swagger
 * /api/asignacion-pie:
 *   get:
 *     summary: Listar asignaciones PIE
 *     tags: [Asignacion PIE]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, listarAsignacionesPieController);

/**
 * @swagger
 * /api/asignacion-pie/{id}:
 *   get:
 *     summary: Obtener una asignacion PIE
 *     tags: [Asignacion PIE]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authMiddleware, obtenerAsignacionPieController);

/**
 * @swagger
 * /api/asignacion-pie/{id}/finalizar:
 *   patch:
 *     summary: Finalizar una asignacion PIE
 *     tags: [Asignacion PIE]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/finalizar",
  authMiddleware,
  finalizarAsignacionPieController,
);

export default router;
