import { Router } from 'express';
import { listarUsuariosSinRolController } from '../controllers/usuario.controller.js';
import { asignarRolController } from '../controllers/asignacion.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import prisma from '../config/prisma.js';

const router = Router();

router.get('/usuarios-sin-rol', authMiddleware, listarUsuariosSinRolController);
router.post('/asignar-rol', authMiddleware, asignarRolController);

// Nuevo endpoint
router.get('/roles', authMiddleware, async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();
    res.json({ ok: true, roles });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

export default router;
