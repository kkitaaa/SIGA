import { Router } from "express";
import { listarUsuariosSinRolController } from "../controllers/usuario.controller.js";
import { verificarToken } from "../middleware/auth.js";

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
  verificarToken,
  listarUsuariosSinRolController
);

export default router;