import { Router } from "express";
import { listarProfesionalesController } from "../controllers/funcionario.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FuncionarioPIE:
 *       type: object
 *       properties:
 *         id_funcionario:
 *           type: integer
 *           example: 8
 *         nombre:
 *           type: string
 *           example: "Juan Pérez"
 *         tipo_profesional:
 *           type: string
 *           example: "Psicólogo"
 */

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     summary: Listar todos los profesionales disponibles (para PIE)
 *     description: Obtiene la lista de funcionarios formateada con sus nombres y el tipo de rol profesional para usar en asignaciones del programa.
 *     tags:
 *       - Funcionarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FuncionarioPIE'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

router.get("/", authMiddleware, listarProfesionalesController);

export default router;