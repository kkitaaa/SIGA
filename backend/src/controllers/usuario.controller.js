import prisma from '../config/prisma.js';
import { obtenerUsuariosSinRol } from '../services/usuario.service.js';

export const listarUsuariosSinRolController = async (req, res) => {
  try {
    const esAdministrativo = await prisma.usuario_rol.findFirst({
      where: {
        id_usuario: req.user.id_usuario, 
        rol: { nombre_rol: 'Administrativo' }
      }
    });

    if (!esAdministrativo) {
      return res.status(403).json({ ok: false, mensaje: 'Acceso denegado' });
    }

    const usuarios = await obtenerUsuariosSinRol();
    res.json({ ok: true, usuarios });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};
