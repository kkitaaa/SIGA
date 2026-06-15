import { subirDocumento } from '../services/documento.service.js';

export const subirDocumentoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe adjuntar un archivo',
      });
    }

    const documento = await subirDocumento(req.file);

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