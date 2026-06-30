import { Router } from "express";
import { listarUsuariosSinRolController } from "../controllers/usuario.controller.js";
import {
  asignarRolController,
  revocarRolController,
} from "../controllers/asignacion.controller.js";
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
 *
 *     Rol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 */

/**
 * @swagger
 * /api/usuarios-sin-rol:
 *   get:
 *     summary: Listar usuarios sin rol asignado
 *     tags:
 *       - Asignacion
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios sin rol
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
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
 *               idTipoFuncionario:
 *                 type: integer
 *                 description: Opcional. Obligatorio únicamente cuando el rol asignado sea Funcionario.
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

/**
 * @swagger
 * /api/asignacion/revocar-rol/{idUsuario}:
 *   delete:
 *     summary: Revocar rol de un usuario
 *     tags:
 *       - Asignacion
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario al que se le revocará el rol
 *     responses:
 *       200:
 *         description: Rol revocado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Error de permisos o validaciones
 */
router.delete("/revocar-rol/:idUsuario", authMiddleware, revocarRolController);

export default router;
