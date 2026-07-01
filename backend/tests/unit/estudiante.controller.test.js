import { jest } from "@jest/globals";

const serviceMock = {
  registrarEstudiante: jest.fn(),
  listarEstudiantes: jest.fn(),
  listarEstudiantesNee: jest.fn(),
  obtenerEstudiantePorId: jest.fn(),
  actualizarEstudiante: jest.fn(),
};

jest.unstable_mockModule("../../src/services/estudiante.service.js", () => ({
  EstudianteService: serviceMock,
}));

let registrarEstudianteController;
let listarEstudiantesController;
let listarEstudiantesNeeController;
let obtenerEstudiantePorIdController;
let actualizarEstudianteController;

beforeAll(async () => {
  ({
    registrarEstudianteController,
    listarEstudiantesController,
    listarEstudiantesNeeController,
    obtenerEstudiantePorIdController,
    actualizarEstudianteController,
  } = await import("../../src/controllers/estudiante.controller.js"));
});

describe("estudiante.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registra estudiante y devuelve 201", async () => {
    serviceMock.registrarEstudiante.mockResolvedValue({ id_estudiante: 1 });
    const req = {
      body: {
        rut: "12345678-9",
        primer_nombre: "Juan",
        primer_apellido: "Pérez",
        sexo: "Masculino",
        fecha_nacimiento: "2015-04-12",
        id_curso: 3,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await registrarEstudianteController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Estudiante registrado con éxito",
      estudiante: { id_estudiante: 1 },
    });
  });

  test("lista estudiantes y devuelve 200", async () => {
    serviceMock.listarEstudiantes.mockResolvedValue([{ id_estudiante: 1 }]);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarEstudiantesController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true, estudiantes: [{ id_estudiante: 1 }] });
  });

  test("lista estudiantes NEE", async () => {
    serviceMock.listarEstudiantesNee.mockResolvedValue([{ id_estudiante: 2, es_nee: true }]);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarEstudiantesNeeController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("devuelve 404 cuando no existe el estudiante buscado", async () => {
    serviceMock.obtenerEstudiantePorId.mockRejectedValue(new Error("BUSINESS_ERROR: Estudiante no encontrado"));
    const req = { params: { id: "99" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await obtenerEstudiantePorIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("actualiza un estudiante y responde 200", async () => {
    serviceMock.actualizarEstudiante.mockResolvedValue({ id_estudiante: 1 });
    const req = { params: { id: "1" }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await actualizarEstudianteController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
