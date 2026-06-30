import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.js";
import { subirDocumentoController, listarDocumentosController } from "../controllers/documento.controller.js";

const router = Router();

/**
 * @swagger
 * /api/documento:
 *   post:
 *     summary: Subir documento institucional
 *     tags:
 *       - Documentos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Documento subido correctamente
 *       400:
 *         description: Archivo inválido
 *       401:
 *         description: No autorizado
 */
router.post(
  "/",
  authMiddleware,
  upload.single("archivo"),
  subirDocumentoController,
);

/**
 * @swagger
 * /api/documentos:
 *   get:
 *     summary: Listar documentos registrados (Consulta Paginada)
 *     description: Obtiene la lista de todos los documentos registrados utilizando paginación nativa.
 *     tags:
 *       - Documentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página a consultar
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de documentos por página
 *     responses:
 *       200:
 *         description: Lista de documentos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 documentos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Documento'
 *                 paginacion:
 *                   type: object
 *                   properties:
 *                     totalDocumentos:
 *                       type: integer
 *                       example: 25
 *                     paginaActual:
 *                       type: integer
 *                       example: 1
 *                     totalPaginas:
 *                       type: integer
 *                       example: 3
 *                     limite:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Los parámetros de paginación deben ser mayores a 0
 *       401:
 *         description: No autorizado (Token JWT faltante o inválido)
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authMiddleware, listarDocumentosController);

export default router;
