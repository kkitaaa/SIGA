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

describe("error branch coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("cubre los errores inesperados de los controladores de estudiante", async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    serviceMock.registrarEstudiante.mockRejectedValue(new Error("boom"));
    await registrarEstudianteController(
      {
        body: {
          rut: "12345678-9",
          primer_nombre: "Juan",
          primer_apellido: "Pérez",
          sexo: "Masculino",
          fecha_nacimiento: "2015-04-12",
          id_curso: 3,
        },
      },
      res,
    );
    expect(res.status).toHaveBeenCalledWith(500);

    serviceMock.listarEstudiantes.mockRejectedValue(new Error("boom"));
    await listarEstudiantesController({}, res);
    expect(res.status).toHaveBeenCalledWith(500);

    serviceMock.listarEstudiantesNee.mockRejectedValue(new Error("boom"));
    await listarEstudiantesNeeController({}, res);
    expect(res.status).toHaveBeenCalledWith(500);

    serviceMock.obtenerEstudiantePorId.mockRejectedValue(new Error("boom"));
    await obtenerEstudiantePorIdController({ params: { id: "1" } }, res);
    expect(res.status).toHaveBeenCalledWith(500);

    serviceMock.actualizarEstudiante.mockRejectedValue(new Error("boom"));
    await actualizarEstudianteController({ params: { id: "1" }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("cubre el caso business_error para obtener y actualizar estudiante", async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    serviceMock.obtenerEstudiantePorId.mockRejectedValue(new Error("BUSINESS_ERROR: no existe"));
    await obtenerEstudiantePorIdController({ params: { id: "1" } }, res);
    expect(res.status).toHaveBeenCalledWith(404);

    serviceMock.actualizarEstudiante.mockRejectedValue(new Error("BUSINESS_ERROR: no existe"));
    await actualizarEstudianteController({ params: { id: "1" }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
