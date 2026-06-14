import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.middleware.js";
import { listarUsuariosSinRolController } from "../controllers/usuario.controller.js";
import { ROLES } from "../constants/roles.js";   // ✅ Importar constantes

const router = Router();

/**
 * @swagger
 * /api/usuario/usuarios-sin-rol:
 *   get:
 *     summary: Lista usuarios sin rol
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/usuarios-sin-rol",
  authMiddleware,
  verifyRole(ROLES.ADMINISTRATIVO),   // ✅ Usar constante
  listarUsuariosSinRolController,
);

export default router;
