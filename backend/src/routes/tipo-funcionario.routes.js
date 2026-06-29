import { Router } from "express";
import {
  registrarTipoFuncionarioController,
  listarTiposFuncionarioController,
  obtenerDetalleTipoFuncionarioController,
  actualizarTipoFuncionarioController,
  desactivarTipoFuncionarioController,
} from "../controllers/tipo-funcionario.controller.js";
import { authMiddleware, verifyRole } from "../middlewares/auth.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: TipoFuncionario
 *   description: Administración de tipos de funcionario
 */

/**
 * @swagger
 * /api/funcionarios:
 *   post:
 *     summary: Registrar un nuevo tipo de funcionario
 *     tags: [TipoFuncionario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Psicólogo
 *               descripcion:
 *                 type: string
 *                 example: Profesional encargado del apoyo psicológico
 *     responses:
 *       200:
 *         description: Tipo de funcionario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de funcionario registrado correctamente
 */

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     summary: Listar todos los tipos de funcionario
 *     tags: [TipoFuncionario]
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
 *                 type: object
 *                 properties:
 *                   id_tipo_funcionario:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: Psicólogo
 *                   descripcion:
 *                     type: string
 *                     example: Profesional encargado del apoyo psicológico
 *                   activo:
 *                     type: boolean
 *                     example: true
 */

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   get:
 *     summary: Obtener detalle de un tipo de funcionario
 *     tags: [TipoFuncionario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de funcionario
 *     responses:
 *       200:
 *         description: Detalle obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_tipo_funcionario:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: Psicólogo
 *                 descripcion:
 *                   type: string
 *                   example: Profesional encargado del apoyo psicológico
 *                 activo:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   put:
 *     summary: Actualizar un tipo de funcionario
 *     tags: [TipoFuncionario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de funcionario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Fonoaudiólogo
 *               descripcion:
 *                 type: string
 *                 example: Profesional encargado del apoyo en lenguaje y comunicación
 *     responses:
 *       200:
 *         description: Tipo de funcionario actualizado correctamente
 */

/**
 * @swagger
 * /api/funcionarios/{id}/desactivar:
 *   patch:
 *     summary: Desactivar un tipo de funcionario
 *     tags: [TipoFuncionario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de funcionario
 *     responses:
 *       200:
 *         description: Tipo de funcionario desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Tipo de funcionario desactivado correctamente
 */


router.post(
  "/funcionarios",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  registrarTipoFuncionarioController
);

router.get("/funcionarios", authMiddleware, listarTiposFuncionarioController);
router.get("/funcionarios/:id", authMiddleware, obtenerDetalleTipoFuncionarioController);
router.put(
  "/funcionarios/:id",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  actualizarTipoFuncionarioController
);
router.patch(
  "/funcionarios/:id/desactivar",
  authMiddleware,
  verifyRole("Directiva", "Coordinador Administrativo"),
  desactivarTipoFuncionarioController
);

export default router;
