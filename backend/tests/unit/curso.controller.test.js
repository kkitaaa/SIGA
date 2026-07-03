import { jest } from "@jest/globals";

const crearCursoMock = jest.fn();
const obtenerCursosMock = jest.fn();

jest.unstable_mockModule("../../src/services/curso.service.js", () => ({
  CursoService: jest.fn().mockImplementation(() => ({
    crearCurso: crearCursoMock,
    obtenerCursos: obtenerCursosMock,
  })),
}));

let crearCursoController;
let obtenerCursosController;

beforeAll(async () => {
  ({ crearCursoController, obtenerCursosController } =
    await import("../../src/controllers/curso.controller.js"));
});

describe("curso.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("crea curso y responde 201", async () => {
    crearCursoMock.mockResolvedValue({ id_curso: 1 });
    const req = {
      body: {
        nivel_educativo: "Media",
        nivel_curso: "Cuarto",
        letra: "A",
        id_profesor: 3,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearCursoController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("obtiene cursos y responde 200", async () => {
    obtenerCursosMock.mockResolvedValue([{ id_curso: 1 }]);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await obtenerCursosController({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("devuelve 400 cuando el DTO tiene error de validación", async () => {
    crearCursoMock.mockRejectedValue(
      new Error("VALIDATION_ERROR: dato inválido"),
    );
    const req = {
      body: {
        nivel_educativo: "Media",
        nivel_curso: "Cuarto",
        letra: "A",
        id_profesor: 3,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearCursoController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "dato inválido" });
  });

  test("devuelve 409 cuando hay un error de negocio", async () => {
    crearCursoMock.mockRejectedValue(
      new Error("BUSINESS_ERROR: curso duplicado"),
    );
    const req = {
      body: {
        nivel_educativo: "Media",
        nivel_curso: "Cuarto",
        letra: "A",
        id_profesor: 3,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearCursoController(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "curso duplicado" });
  });

  test("devuelve 500 para errores inesperados", async () => {
    crearCursoMock.mockRejectedValue(new Error("boom"));
    const req = {
      body: {
        nivel_educativo: "Media",
        nivel_curso: "Cuarto",
        letra: "A",
        id_profesor: 3,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await crearCursoController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error interno al crear el curso",
    });
  });
});
