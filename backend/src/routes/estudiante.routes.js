import { Router } from "express";
import { registrarEstudianteController } from "../controllers/estudiante.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CrearEstudiante:
 *       type: object
 *       required:
 *         - rut
 *         - primer_nombre
 *         - primer_apellido
 *         - sexo
 *         - fecha_nacimiento
 *         - id_curso
 *       properties:
 *         rut:
 *           type: string
 *           example: "12345678-9"
 *         primer_nombre:
 *           type: string
 *           example: "Juan"
 *         segundo_nombre:
 *           type: string
 *           example: "Pablo"
 *         primer_apellido:
 *           type: string
 *           example: "Pérez"
 *         segundo_apellido:
 *           type: string
 *           example: "González"
 *         sexo:
 *           type: string
 *           example: "Masculino"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "2015-04-12"
 *         fecha_ingreso:
 *           type: string
 *           format: date
 *           example: "2026-03-01"
 *         id_curso:
 *           type: integer
 *           example: 3
 */

/**
 * @swagger
 * /api/estudiantes:
 *   post:
 *     summary: Registrar un estudiante
 *     description: Permite registrar un nuevo estudiante en el sistema.
 *     tags:
 *       - Estudiantes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearEstudiante'
 *     responses:
 *       201:
 *         description: Estudiante registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  registrarEstudianteController,
);

export default router;