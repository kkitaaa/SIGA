import { jest } from "@jest/globals";

const prismaMock = {
  tipoFuncionario: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

let TipoFuncionarioRepository;

beforeAll(async () => {
  ({ TipoFuncionarioRepository } =
    await import("../../src/repositories/tipo-funcionario.repository.js"));
});

describe("TipoFuncionarioRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("crea, lista, obtiene, actualiza y desactiva un tipo funcionario", async () => {
    const repo = new TipoFuncionarioRepository();
    prismaMock.tipoFuncionario.create.mockResolvedValue({
      id_tipo_funcionario: 1,
    });
    prismaMock.tipoFuncionario.findMany.mockResolvedValue([
      { id_tipo_funcionario: 1 },
    ]);
    prismaMock.tipoFuncionario.findUnique.mockResolvedValue({
      id_tipo_funcionario: 1,
    });
    prismaMock.tipoFuncionario.update.mockResolvedValue({
      id_tipo_funcionario: 1,
      activo: false,
    });

    await expect(repo.crear({ nombre: "Psicólogo" })).resolves.toEqual({
      id_tipo_funcionario: 1,
    });
    await expect(repo.listar()).resolves.toEqual([{ id_tipo_funcionario: 1 }]);
    await expect(repo.obtenerPorId(1)).resolves.toEqual({
      id_tipo_funcionario: 1,
    });
    await expect(repo.actualizar(1, { nombre: "Terapeuta" })).resolves.toEqual({
      id_tipo_funcionario: 1,
      activo: false,
    });
    await expect(repo.desactivar(1)).resolves.toEqual({
      id_tipo_funcionario: 1,
      activo: false,
    });
    await expect(repo.buscarPorNombre("Psicólogo")).resolves.toEqual({
      id_tipo_funcionario: 1,
    });
  });
});
