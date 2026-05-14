import { Router } from 'express';
import { asignarRolController } from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/asignar-rol', verificarToken, asignarRolController);

export default router;
