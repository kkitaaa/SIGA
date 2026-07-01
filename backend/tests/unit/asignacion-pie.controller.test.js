import { jest } from "@jest/globals";

const serviceMock = {
  crearAsignacion: jest.fn(),
  listarAsignaciones: jest.fn(),
  obtenerAsignacion: jest.fn(),
  finalizarAsignacion: jest.fn(),
};

jest.unstable_mockModule("../../src/services/asignacion-pie.service.js", () => ({
  AsignacionPieService: jest.fn().mockImplementation(() => serviceMock),
}));

let crearAsignacionPieController;
let listarAsignacionesPieController;
let obtenerAsignacionPieController;
let finalizarAsignacionPieController;

beforeAll(async () => {
  ({
    crearAsignacionPieController,
    listarAsignacionesPieController,
    obtenerAsignacionPieController,
    finalizarAsignacionPieController,
  } = await import("../../src/controllers/asignacion-pie.controller.js"));
});

describe("asignacion-pie.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rechaza creación si el dto no es válido", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearAsignacionPieController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("crea asignación y responde 201", async () => {
    serviceMock.crearAsignacion.mockResolvedValue({ ok: true });
    const req = {
      body: { idEstudiante: 1, idFuncionario: 2 },
      user: { id_usuario: 7 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearAsignacionPieController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("lista asignaciones", async () => {
    serviceMock.listarAsignaciones.mockResolvedValue({ asignaciones: [] });
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarAsignacionesPieController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
