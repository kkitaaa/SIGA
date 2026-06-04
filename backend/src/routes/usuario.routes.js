import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.middleware.js";
import { listarUsuariosSinRolController } from "../controllers/usuario.controller.js";
const router = Router();

/**git
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
  verifyRole("Administrativo"),
  listarUsuariosSinRolController
);

export default router;