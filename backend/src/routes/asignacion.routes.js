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
router.post("/asignar-rol", authMiddleware, asignarRolController);
router.get("/roles", authMiddleware, listarRolesController);

export default router;
