// src/routes/usuario.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.middleware.js";
import {
  listarUsuariosSinRolController,
  listarUsuariosController,
} from "../controllers/usuario.controller.js";

const router = Router();

/**
 * @swagger
 * /api/usuario/usuarios:
 *   get:
 *     summary: Lista todos los usuarios con su rol asignado
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: Juan Pérez
 *                       correo:
 *                         type: string
 *                         example: juan@test.com
 *                       rol:
 *                         type: string
 *                         example: Administrativo
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso restringido a rol Administrativo
 *       500:
 *         description: Error del servidor
 */

// Usuarios sin rol
router.get(
  "/usuarios-sin-rol",
  authMiddleware,
  verifyRole("Directiva", "Administrativo","Coordinador Administrativo"),
  listarUsuariosSinRolController,
);

// Todos los usuarios con rol
router.get(
  "/usuarios",
  authMiddleware,
  verifyRole("Directiva", "Administrativo","Coordinador Administrativo"),
  listarUsuariosController,
);

export default router; 
