import { jest } from "@jest/globals";

const serviceMock = {
  listarProfesionales: jest.fn(),
};

jest.unstable_mockModule("../../src/services/funcionario.service.js", () => ({
  FuncionarioService: serviceMock,
}));

let listarProfesionalesController;

beforeAll(async () => {
  ({ listarProfesionalesController } =
    await import("../../src/controllers/funcionario.controller.js"));
});

describe("funcionario.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve la lista de profesionales", async () => {
    serviceMock.listarProfesionales.mockResolvedValue([
      { id_funcionario: 1, nombre: "Ana López" },
    ]);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarProfesionalesController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id_funcionario: 1, nombre: "Ana López" },
    ]);
  });
});
