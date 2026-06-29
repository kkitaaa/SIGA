import { TipoFuncionarioService } from "../services/tipo-funcionario.service.js";

const service = new TipoFuncionarioService();

export const registrarTipoFuncionarioController = async (req, res) => {
  try {
    await service.registrarTipo(req.body);
    res.json({
      ok: true,
      mensaje: "Tipo de funcionario registrado correctamente",
    });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

export const listarTiposFuncionarioController = async (req, res) => {
  const tipos = await service.listarTipos();
  res.json(tipos);
};

export const obtenerDetalleTipoFuncionarioController = async (req, res) => {
  try {
    const tipo = await service.obtenerDetalle(Number(req.params.id));
    res.json(tipo);
  } catch (error) {
    res.status(404).json({ ok: false, mensaje: error.message });
  }
};

export const actualizarTipoFuncionarioController = async (req, res) => {
  const tipo = await service.actualizarTipo(Number(req.params.id), req.body);
  res.json(tipo);
};

export const desactivarTipoFuncionarioController = async (req, res) => {
  await service.desactivarTipo(Number(req.params.id));
  res.json({
    ok: true,
    mensaje: "Tipo de funcionario desactivado correctamente",
  });
};
