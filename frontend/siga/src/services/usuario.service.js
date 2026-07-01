import api from "./api";

export const usuarioService = {
  async listarUsuarios() {
    const { data } = await api.get("/usuario/usuarios");
    return data?.usuarios || [];
  },

  async listarUsuariosSinRol() {
    const { data } = await api.get("/usuario/usuarios-sin-rol");
    return data?.usuarios || [];
  },
};
