import { Router } from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { authMiddleware } from '../middleware/auth.js';
import { subirDocumentoController } from '../controllers/documento.controller.js';

const router = Router();

/**
 * @swagger
 * /api/documentos:
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
  '/',
  authMiddleware,
  upload.single('archivo'),
  subirDocumentoController,
);

router.get('/storage-test', async (req, res) => {
  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

export default router;