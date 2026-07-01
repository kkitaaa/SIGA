import { FuncionarioService } from "../services/funcionario.service.js";

export const listarProfesionalesController = async (req, res) => {
  try {
    const profesionales = await FuncionarioService.listarProfesionales();

    return res.status(200).json(profesionales);
  } catch (error) {
    console.error("Error al listar profesionales:", error);
    return res
      .status(500)
      .json({ error: "Error interno al obtener profesionales" });
  }
};
