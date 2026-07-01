import { jest } from "@jest/globals";

const repoMock = {
  buscarPorNombre: jest.fn(),
  crear: jest.fn(),
  listar: jest.fn(),
  obtenerPorId: jest.fn(),
  actualizar: jest.fn(),
  desactivar: jest.fn(),
};

jest.unstable_mockModule("../../src/repositories/tipo-funcionario.repository.js", () => ({
  TipoFuncionarioRepository: jest.fn().mockImplementation(() => repoMock),
}));

let TipoFuncionarioService;

beforeAll(async () => {
  ({ TipoFuncionarioService } = await import("../../src/services/tipo-funcionario.service.js"));
});

describe("TipoFuncionarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registra un tipo cuando no existe y no está desactivado", async () => {
    repoMock.buscarPorNombre.mockResolvedValue(null);
    repoMock.crear.mockResolvedValue({ id_tipo_funcionario: 1 });

    const service = new TipoFuncionarioService();
    await expect(service.registrarTipo({ nombre: "Psicólogo", descripcion: "test" })).resolves.toEqual({ id_tipo_funcionario: 1 });
  });

  test("rechaza registrar si ya existe un tipo activo", async () => {
    repoMock.buscarPorNombre.mockResolvedValue({ activo: true });

    const service = new TipoFuncionarioService();
    await expect(service.registrarTipo({ nombre: "Psicólogo" })).rejects.toThrow("Ya existe un tipo de funcionario con ese nombre");
  });

  test("rechaza registrar si el tipo existe pero está desactivado", async () => {
    repoMock.buscarPorNombre.mockResolvedValue({ activo: false });

    const service = new TipoFuncionarioService();
    await expect(service.registrarTipo({ nombre: "Psicólogo" })).rejects.toThrow("El tipo existe pero está desactivado. Reactívalo primero.");
  });

  test("lista tipos y devuelve detalle", async () => {
    repoMock.listar.mockResolvedValue([{ id_tipo_funcionario: 1 }]);
    repoMock.obtenerPorId.mockResolvedValue({ id_tipo_funcionario: 1 });

    const service = new TipoFuncionarioService();
    await expect(service.listarTipos()).resolves.toEqual([{ id_tipo_funcionario: 1 }]);
    await expect(service.obtenerDetalle(1)).resolves.toEqual({ id_tipo_funcionario: 1 });
  });
});
