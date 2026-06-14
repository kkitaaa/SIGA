import { asignarRol } from "../services/asignacion.service.js";

export const asignarRolController = async (req, res) => {
  try {
    const { idUsuarioDestino, idRolAsignado } = req.body;

    if (!idUsuarioDestino || !idRolAsignado) {
      return res.status(400).json({
        ok: false,
        mensaje: "idUsuarioDestino e idRolAsignado son obligatorios",
      });
    }

    const idUsuarioActual = req.user.id_usuario;
    const resultado = await asignarRol(
      idUsuarioDestino,
      idRolAsignado,
      idUsuarioActual,
    );

    return res.status(200).json({ ok: true, resultado });
  } catch (err) {
    return res.status(403).json({ ok: false, mensaje: err.message });
  }
};
