import { Router } from "express";
import {
  registrarEstudianteController,
  listarEstudiantesController,
  listarEstudiantesNeeController,
} from "../controllers/estudiante.controller.js";
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
 *
 *     Estudiante:
 *       type: object
 *       properties:
 *         id_estudiante:
 *           type: integer
 *           example: 1
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
 *           format: date-time
 *         fecha_ingreso:
 *           type: string
 *           format: date-time
 *         es_nee:
 *           type: boolean
 *           example: true
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
  registrarEstudianteController
);

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     summary: Listar todos los estudiantes
 *     description: Obtiene la lista completa de todos los estudiantes registrados en el sistema.
 *     tags:
 *       - Estudiantes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               estudiantes:
 *                 - id_estudiante: 1
 *                   rut: "12345678-9"
 *                   primer_nombre: "Juan"
 *                   primer_apellido: "Pérez"
 *                   es_nee: false
 *                   id_curso: 3
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authMiddleware, listarEstudiantesController);

/**
 * @swagger
 * /api/estudiantes/nee:
 *   get:
 *     summary: Listar estudiantes con Necesidades Educativas Especiales (NEE)
 *     description: Obtiene la lista exclusiva de estudiantes que tienen la condición NEE activa.
 *     tags:
 *       - Estudiantes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               estudiantes:
 *                 - id_estudiante: 2
 *                   rut: "98765432-1"
 *                   primer_nombre: "María"
 *                   primer_apellido: "Gómez"
 *                   es_nee: true
 *                   id_curso: 3
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/nee", authMiddleware, listarEstudiantesNeeController);

export default router;