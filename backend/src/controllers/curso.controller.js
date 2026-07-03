import { CursoService } from "../services/curso.service.js";
import { CreateCursoDTO } from "../dto/create-curso.dto.js";
import { CursoRepository } from "../repositories/curso.repository.js";

const cursoRepository = new CursoRepository();
const cursoService = new CursoService(cursoRepository);

export const crearCursoController = async (req, res) => {
  try {
    const dto = new CreateCursoDTO(req.body);

    const curso = await cursoService.crearCurso(dto);

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
    const cursos = await cursoService.obtenerCursos();
    res.status(200).json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno al obtener los cursos" });
  }
};

export const obtenerCursoPorIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await cursoService.obtenerCursoPorId(id);

    return res.status(200).json({
      ok: true,
      curso,
    });
  } catch (error) {
    console.error("Error en obtenerCursoPorIdController:", error);

    const statusCode = error.message === "Curso no encontrado" ? 404 : 500;
    return res.status(statusCode).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const obtenerCursosPorProfesor = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;

    console.debug(
      `[curso.controller] obtenerCursosPorProfesor idUsuario=${idUsuario}`,
    );

    const profesor = await cursoService.obtenerProfesorPorUsuario(idUsuario);

    if (!profesor) {
      console.debug(
        `[curso.controller] profesor no encontrado para idUsuario=${idUsuario} — devolviendo lista vacía`,
      );
      return res.status(200).json([]);
    }

    const cursos = await cursoService.obtenerCursosPorProfesor(
      profesor.id_profesor,
    );
    console.debug(
      `[curso.controller] profesor.id_profesor=${profesor.id_profesor} cursosCount=${(cursos || []).length}`,
    );

    res.status(200).json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos del profesor:", error);
    res.status(500).json({ error: "Error interno al obtener los cursos" });
  }
};
