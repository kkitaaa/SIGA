// src/services/usuario.service.js
import { UsuarioRepository } from "../repositories/usuario.repository.js";

const repo = new UsuarioRepository();

export const UsuarioService = {
  async obtenerUsuariosSinRol() {
    return repo.findUsuariosSinRol();
  },

  async obtenerUsuariosConRol() {
    const usuarios = await repo.findAllConRol();

    return usuarios.map((u) => ({
      id_usuario: u.id_usuario,
      nombre: `${u.primer_nombre} ${u.primer_apellido}`,
      correo: u.cuenta?.email || "sin correo",
      rol: u.roles[0]?.rol?.nombre_rol || "SinRol",
    }));
  },
};
