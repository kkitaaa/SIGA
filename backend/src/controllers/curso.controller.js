import { CursoService } from "../services/curso.service.js";
import { CreateCursoDTO } from "../dto/create-curso.dto.js";

export const crearCursoController = async (req, res) => {
  try {
    const dto = new CreateCursoDTO(req.body);
    const curso = await CursoService.crearCurso(dto);

    res.status(201).json({
      mensaje: "Curso creado exitosamente",
      curso,
    });
  } catch (error) {
    if (error.message.startsWith("VALIDATION_ERROR:")) {
      return res
        .status(400)
        .json({ error: error.message.replace("VALIDATION_ERROR: ", "") });
    }
    if (error.message.startsWith("BUSINESS_ERROR:")) {
      return res
        .status(409)
        .json({ error: error.message.replace("BUSINESS_ERROR: ", "") });
    }

    console.error("Error al crear curso:", error);
    res.status(500).json({ error: "Error interno al crear el curso" });
  }
};

export const obtenerCursosController = async (req, res) => {
  try {
    const cursos = await CursoService.obtenerCursos();
    res.status(200).json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno al obtener los cursos" });
  }
};
