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
 * components:
 *   schemas:
 *     CrearAsignacionPIE:
 *       type: object
 *       required:
 *         - idEstudiante
 *         - idFuncionario
 *       properties:
 *         idEstudiante:
 *           type: integer
 *           example: 15
 *         idFuncionario:
 *           type: integer
 *           example: 8
 *
 *     AsignacionPIE:
 *       type: object
 *       properties:
 *         id_asignacion:
 *           type: integer
 *           example: 1
 *         id_estudiante:
 *           type: integer
 *           example: 15
 *         id_funcionario:
 *           type: integer
 *           example: 8
 *         fecha_asignacion:
 *           type: string
 *           format: date-time
 *           example: "2026-06-25T14:30:00.000Z"
 *         estado:
 *           type: string
 *           example: "ACTIVA"
 */

/**
 * @swagger
 * /api/asignacion-pie:
 *   post:
 *     summary: Crear una asignación PIE
 *     tags:
 *       - Asignacion PIE
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearAsignacionPIE'
 *     responses:
 *       201:
 *         description: Asignación creada correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               mensaje: "Asignación PIE registrada correctamente"
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudiante o funcionario no encontrado
 *       409:
 *         description: El estudiante ya posee una asignación activa
 */
router.post("/", authMiddleware, crearAsignacionPieController);

/**
 * @swagger
 * /api/asignacion-pie:
 *   get:
 *     summary: Listar asignaciones PIE
 *     tags:
 *       - Asignacion PIE
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *         content:
 *           application/json:
 *             example:
 *               - id_asignacion: 1
 *                 id_estudiante: 15
 *                 id_funcionario: 8
 *                 fecha_asignacion: "2026-06-25T14:30:00.000Z"
 *                 estado: "ACTIVA"
 */
router.get("/", authMiddleware, listarAsignacionesPieController);

/**
 * @swagger
 * /api/asignacion-pie/{id}:
 *   get:
 *     summary: Obtener una asignación PIE por ID
 *     tags:
 *       - Asignacion PIE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Asignación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsignacionPIE'
 *       404:
 *         description: Asignación no encontrada
 */
router.get("/:id", authMiddleware, obtenerAsignacionPieController);

/**
 * @swagger
 * /api/asignacion-pie/{id}/finalizar:
 *   patch:
 *     summary: Finalizar una asignación PIE
 *     tags:
 *       - Asignacion PIE
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Asignación finalizada correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               mensaje: "Asignación PIE finalizada correctamente"
 *       404:
 *         description: Asignación no encontrada
 */
router.patch(
  "/:id/finalizar",
  authMiddleware,
  finalizarAsignacionPieController,
);

export default router;
