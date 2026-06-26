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