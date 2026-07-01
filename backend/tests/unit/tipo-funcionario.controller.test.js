import { jest } from "@jest/globals";

const serviceMock = {
  registrarTipo: jest.fn(),
  listarTipos: jest.fn(),
  obtenerDetalle: jest.fn(),
  actualizarTipo: jest.fn(),
  desactivarTipo: jest.fn(),
};

jest.unstable_mockModule("../../src/services/tipo-funcionario.service.js", () => ({
  TipoFuncionarioService: jest.fn().mockImplementation(() => serviceMock),
}));

let registrarTipoFuncionarioController;
let listarTiposFuncionarioController;
let obtenerDetalleTipoFuncionarioController;
let actualizarTipoFuncionarioController;
let desactivarTipoFuncionarioController;

beforeAll(async () => {
  ({
    registrarTipoFuncionarioController,
    listarTiposFuncionarioController,
    obtenerDetalleTipoFuncionarioController,
    actualizarTipoFuncionarioController,
    desactivarTipoFuncionarioController,
  } = await import("../../src/controllers/tipo-funcionario.controller.js"));
});

describe("tipo-funcionario.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registra tipo y responde ok", async () => {
    serviceMock.registrarTipo.mockResolvedValue({ ok: true });
    const req = { body: { nombre: "Psicólogo" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await registrarTipoFuncionarioController(req, res);

    expect(res.json).toHaveBeenCalledWith({ ok: true, mensaje: "Tipo de funcionario registrado correctamente" });
  });

  test("lista tipos", async () => {
    serviceMock.listarTipos.mockReturnValue([{ id_tipo_funcionario: 1 }]);
    const res = { json: jest.fn() };

    await listarTiposFuncionarioController({}, res);

    expect(res.json).toHaveBeenCalledWith([{ id_tipo_funcionario: 1 }]);
  });
});
