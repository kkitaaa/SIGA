import { listarRoles } from "../services/rol.service.js";

export const listarRolesController = async (req, res) => {
  try {
    const roles = await listarRoles();
    res.status(200).json({ ok: true, roles });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};
