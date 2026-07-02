import api from "./api";

export const estudianteService = {
  async listarEstudiantes() {
    const { data } = await api.get("/estudiantes");
    return data?.estudiantes || [];
  },

  async obtenerEstudiante(id) {
    const { data } = await api.get(`/estudiantes/${id}`);
    return data?.estudiante || data?.data || data;
  },

  async crearEstudiante(payload) {
    const { data } = await api.post("/estudiantes", payload);
    return data?.estudiante || data;
  },

  async actualizarEstudiante(id, payload) {
    const { data } = await api.put(`/estudiantes/${id}`, payload);
    return data?.estudiante || data;
  },

  async desactivarEstudiante(id) {
    const { data } = await api.put(`/estudiantes/${id}`, { activo: false, es_nee: false });
    return data?.estudiante || data;
  },
};
