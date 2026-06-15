import { Router } from "express";
import { listarUsuariosSinRolController } from "../controllers/usuario.controller.js";
import { asignarRolController } from "../controllers/asignacion.controller.js";
import { listarRolesController } from "../controllers/rol.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         correo:
 *           type: string
 *     Rol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 */
router.get("/usuarios-sin-rol", authMiddleware, listarUsuariosSinRolController);

/**
 * @swagger
 * /api/asignacion:
 *   post:
 *     summary: Asignar rol a usuario
 *     tags:
 *       - Asignacion
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUsuarioDestino:
 *                 type: integer
 *               idRolAsignado:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rol asignado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/asignacion", authMiddleware, asignarRolController);

/**
 * @swagger
 * /api/asignacion/roles:
 *   get:
 *     summary: Listar roles disponibles
 *     tags:
 *       - Asignacion
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *       401:
 *         description: No autorizado
 */
router.get("/roles", authMiddleware, listarRolesController);

export default router;
