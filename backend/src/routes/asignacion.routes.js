import { Router } from 'express';
import { listarUsuariosSinRolController } from '../controllers/usuario.controller.js';
import { asignarRolController } from '../controllers/asignacion.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import prisma from '../config/prisma.js';


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
const router = Router();

/**
 * @swagger
 * /usuarios-sin-rol:
 *   get:
 *     summary: Lista los usuarios sin rol asignado
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
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */
router.get('/usuarios-sin-rol', authMiddleware, listarUsuariosSinRolController);
/**
 * @swagger
 * /asignar-rol:
 *   post:
 *     summary: Asigna un rol a un usuario
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
 *               usuarioId:
 *                 type: integer
 *               rolId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rol asignado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 */
router.post('/asignar-rol', authMiddleware, asignarRolController);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene todos los roles disponibles
 *     tags:
 *       - Asignacion
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 roles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rol'
 */
router.get('/roles', authMiddleware, async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();
    res.json({ ok: true, roles });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

export default router;
