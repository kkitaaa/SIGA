// src/services/usuario.service.js
import { UsuarioRepository } from "../repositories/usuario.repository.js";

const repo = new UsuarioRepository();

export const UsuarioService = {
  async obtenerUsuariosSinRol() {
    return repo.findUsuariosSinRol();
  },

  async obtenerUsuariosConRol() {
    return repo.findAllConRol();
  },
};
