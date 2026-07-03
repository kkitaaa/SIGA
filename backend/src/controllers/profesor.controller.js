import { ProfesorRepository } from "../repositories/profesor.repository.js";
import { ProfesorService } from "../services/profesor.service.js";

const profesorRepository = new ProfesorRepository();
const profesorService = new ProfesorService(profesorRepository);

export const getMetricasProfesor = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;

    const metricas =
      await profesorService.obtenerMetricasProfesorPorUsuario(idUsuario);

    if (!metricas) {
      console.debug(
        `[profesor.controller] no hay métricas para idUsuario=${idUsuario} — devolviendo ceros`,
      );
      return res
        .status(200)
        .json({ estudiantesTotales: 0, estudiantesPie: 0, cursosTotales: 0 });
    }

    res.status(200).json(metricas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener las métricas del profesor" });
  }
};
