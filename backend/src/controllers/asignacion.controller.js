import { asignarRol } from '../services/asignacion.service.js';

export const asignarRolController = async (req, res) => {
  try {
    const { idUsuarioDestino, idRolAsignado } = req.body;
    const idUsuarioActual = req.user.id; // viene del middleware de auth
    const resultado = await asignarRol(idUsuarioDestino, idRolAsignado, idUsuarioActual);
    res.status(200).json({ ok: true, resultado });
  } catch (err) {
    res.status(403).json({ ok: false, mensaje: err.message });
  }
};
