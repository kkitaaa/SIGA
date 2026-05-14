import { Router } from 'express';
import { listarUsuariosSinRolController } from '../controllers/usuario.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/usuarios-sin-rol', authMiddleware, listarUsuariosSinRolController);

export default router;
