import { DocumentoService } from "../services/documento.service.js";
import { DocumentoRepository } from "../repositories/documento.repository.js";

// Instanciamos las clases (Ensamblaje de dependencias)
const repository = new DocumentoRepository();
const service = new DocumentoService(repository);

// Controlador original para subir
export const subirDocumentoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe adjuntar un archivo",
      });
    }

    // Llamamos al servicio instanciado
    const documento = await service.subirDocumento(req.file, req.user.id_usuario);

    return res.status(201).json({
      ok: true,
      documento,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

// Nuevo controlador para listar
export const listarDocumentosController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Llamamos al servicio instanciado
    const resultado = await service.obtenerDocumentosPaginados(page, limit);

    return res.status(200).json({
      ok: true,
      ...resultado
    });
  } catch (error) {
    const statusCode = error.message.includes("paginación") ? 400 : 500;
    return res.status(statusCode).json({
      ok: false,
      mensaje: statusCode === 400 ? error.message : "Error interno del servidor",
    });
  }
};