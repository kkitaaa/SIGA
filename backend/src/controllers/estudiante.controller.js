import { EstudianteService } from "../services/estudiante.service.js";
import { CreateEstudianteDTO } from "../dto/create-estudiante.dto.js";

export const registrarEstudianteController = async (req, res) => {
  try {
    const dto = new CreateEstudianteDTO(req.body);

    const estudiante = await EstudianteService.registrarEstudiante(dto);

    return res.status(201).json({
      mensaje: "Estudiante registrado con éxito",
      estudiante,
    });
  } catch (error) {
    if (error.message?.startsWith("VALIDATION_ERROR:")) {
      return res.status(400).json({
        error: error.message.replace("VALIDATION_ERROR: ", ""),
      });
    }

    if (error.message?.startsWith("BUSINESS_ERROR:")) {
      return res.status(409).json({
        error: error.message.replace("BUSINESS_ERROR: ", ""),
      });
    }

    console.error("Error al registrar estudiante:", error);

    return res.status(500).json({
      error: "Error interno al crear el estudiante",
    });
  }
};

// listar TODOS los estudiantes
export const listarEstudiantesController = async (req, res) => {
  try {
    const estudiantes = await EstudianteService.listarEstudiantes();

    return res.status(200).json({
      ok: true,
      estudiantes,
    });
  } catch (error) {
    console.error("Error al listar estudiantes:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno al obtener estudiantes",
    });
  }
};

// listar SOLO los estudiantes NEE
export const listarEstudiantesNeeController = async (req, res) => {
  try {
    const estudiantes = await EstudianteService.listarEstudiantesNee();

    return res.status(200).json({
      ok: true,
      estudiantes,
    });
  } catch (error) {
    console.error("Error al listar estudiantes NEE:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno al obtener estudiantes NEE",
    });
  }
};

export const obtenerEstudiantePorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await EstudianteService.obtenerEstudiantePorId(id);

    return res.status(200).json({
      ok: true,
      estudiante,
    });
  } catch (error) {
    if (error.message?.startsWith("VALIDATION_ERROR:")) {
      return res.status(400).json({
        ok: false,
        error: error.message.replace("VALIDATION_ERROR: ", ""),
      });
    }

    if (error.message?.startsWith("BUSINESS_ERROR:")) {
      return res.status(404).json({
        ok: false,
        error: error.message.replace("BUSINESS_ERROR: ", ""),
      });
    }

    console.error("Error al obtener estudiante:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno al obtener estudiante",
    });
  }
};
