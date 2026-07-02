import { DocumentoService } from "../services/documento.service.js";
import { DocumentoRepository } from "../repositories/documento.repository.js";

const repository = new DocumentoRepository();
const service = new DocumentoService(repository);

export const subirDocumentoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe adjuntar un archivo",
      });
    }

    const nombreDocumento = req.body.nombre || req.file.originalname;

    const documento = await service.subirDocumento(
      req.file,
      nombreDocumento,
      req.user.id_usuario,
    );

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

export const listarDocumentosController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const resultado = await service.obtenerDocumentosPaginados(page, limit);

    return res.status(200).json({
      ok: true,
      ...resultado,
    });
  } catch (error) {
    const statusCode = error.message.includes("paginación") ? 400 : 500;
    return res.status(statusCode).json({
      ok: false,
      mensaje:
        statusCode === 400 ? error.message : "Error interno del servidor",
    });
  }
};
