import { jest } from "@jest/globals";

const repoMock = {
  findAllFuncionarios: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/repositories/funcionario.repository.js",
  () => ({
    FuncionarioRepository: repoMock,
  }),
);

let FuncionarioService;

beforeAll(async () => {
  ({ FuncionarioService } =
    await import("../../src/services/funcionario.service.js"));
});

describe("FuncionarioService integration", () => {
  beforeEach(() => jest.clearAllMocks());

  test("listarProfesionales devuelve arreglo mapeado", async () => {
    repoMock.findAllFuncionarios.mockResolvedValue([
      {
        id_funcionario: 1,
        usuario: { primer_nombre: "Ana", primer_apellido: "Diaz" },
        tipoFuncionario: { nombre: "Psicólogo" },
      },
    ]);

    const res = await FuncionarioService.listarProfesionales();

    expect(res).toEqual([
      { id_funcionario: 1, nombre: "Ana Diaz", tipo_profesional: "Psicólogo" },
    ]);
  });
});
