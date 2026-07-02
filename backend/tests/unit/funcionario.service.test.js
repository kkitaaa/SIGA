import { jest } from "@jest/globals";

const repositoryMock = {
  findAllFuncionarios: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/repositories/funcionario.repository.js",
  () => ({
    FuncionarioRepository: {
      findAllFuncionarios: repositoryMock.findAllFuncionarios,
    },
  }),
);

let FuncionarioService;

beforeAll(async () => {
  ({ FuncionarioService } =
    await import("../../src/services/funcionario.service.js"));
});

describe("FuncionarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lista profesionales con formato plano", async () => {
    repositoryMock.findAllFuncionarios.mockResolvedValue([
      {
        id_funcionario: 1,
        usuario: { primer_nombre: "Ana", primer_apellido: "López" },
        tipoFuncionario: { nombre: "Psicólogo" },
      },
    ]);

    await expect(FuncionarioService.listarProfesionales()).resolves.toEqual([
      {
        id_funcionario: 1,
        nombre: "Ana López",
        tipo_profesional: "Psicólogo",
      },
    ]);
  });
});
