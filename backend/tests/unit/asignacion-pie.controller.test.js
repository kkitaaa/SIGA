import { jest } from "@jest/globals";

const serviceMock = {
  crearAsignacion: jest.fn(),
  listarAsignaciones: jest.fn(),
  obtenerAsignacion: jest.fn(),
  finalizarAsignacion: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/services/asignacion-pie.service.js",
  () => ({
    AsignacionPieService: jest.fn().mockImplementation(() => serviceMock),
  }),
);

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

  test("devuelve 404 cuando la creación falla por negocio", async () => {
    serviceMock.crearAsignacion.mockRejectedValue({
      statusCode: 404,
      message: "No existe",
    });
    const req = {
      body: { idEstudiante: 1, idFuncionario: 2 },
      user: { id_usuario: 7 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearAsignacionPieController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("devuelve 500 cuando la creación falla sin statusCode", async () => {
    serviceMock.crearAsignacion.mockRejectedValue(new Error("boom"));
    const req = {
      body: { idEstudiante: 1, idFuncionario: 2 },
      user: { id_usuario: 7 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearAsignacionPieController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("obtiene y finaliza asignaciones", async () => {
    serviceMock.obtenerAsignacion.mockResolvedValue({ id: 1 });
    serviceMock.finalizarAsignacion.mockResolvedValue({ ok: true });

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await obtenerAsignacionPieController({ params: { id: "1" } }, res);
    expect(res.status).toHaveBeenCalledWith(200);

    await finalizarAsignacionPieController(
      { params: { id: "1" }, user: { id_usuario: 7 } },
      res,
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
