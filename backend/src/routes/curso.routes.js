import { Router } from "express";
import {
  crearCursoController,
  obtenerCursosController,
  obtenerCursoPorIdController,
} from "../controllers/curso.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CrearCurso:
 *       type: object
 *       required:
 *         - nivel_educativo
 *         - nivel_curso
 *         - letra
 *       properties:
 *         nivel_educativo:
 *           type: string
 *           example: "Básica"
 *         nivel_curso:
 *           type: string
 *           example: "5°"
 *         letra:
 *           type: string
 *           example: "A"
 *         id_profesor:
 *           type: integer
 *           nullable: true
 *           example: 1
 *
 *     Curso:
 *       type: object
 *       properties:
 *         id_curso:
 *           type: integer
 *           example: 1
 *         nivel_educativo:
 *           type: string
 *           example: "Básica"
 *         nivel_curso:
 *           type: string
 *           example: "5°"
 *         letra:
 *           type: string
 *           example: "A"
 *         id_profesor:
 *           type: integer
 *           nullable: true
 *           example: 1
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Obtener todos los cursos
 *     description: Retorna la lista de cursos registrados en el sistema.
 *     tags:
 *       - Cursos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida correctamente.
 *         content:
 *           application/json:
 *             example:
 *               - id_curso: 1
 *                 nivel_educativo: "Básica"
 *                 nivel_curso: "5°"
 *                 letra: "A"
 *                 id_profesor: 1
 *               - id_curso: 2
 *                 nivel_educativo: "Media"
 *                 nivel_curso: "2°"
 *                 letra: "B"
 *                 id_profesor: null
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, obtenerCursosController);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un nuevo curso
 *     description: Permite registrar un nuevo curso en el sistema.
 *     tags:
 *       - Cursos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearCurso'
 *     responses:
 *       201:
 *         description: Curso creado correctamente.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Curso registrado correctamente"
 *               curso:
 *                 id_curso: 1
 *                 nivel_educativo: "Básica"
 *                 nivel_curso: "5°"
 *                 letra: "A"
 *                 id_profesor: 1
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No tiene permisos para crear cursos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  crearCursoController,
);

router.get('/:id', obtenerCursoPorIdController);

export default router;
