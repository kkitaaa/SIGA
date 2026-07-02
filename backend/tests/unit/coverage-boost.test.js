import { jest } from "@jest/globals";
import { LoginDTO } from "../../src/dto/login.dto.js";
import { RegisterDTO } from "../../src/dto/register.dto.js";
import { CreateCursoDTO } from "../../src/dto/create-curso.dto.js";
import { CreateEstudianteDTO } from "../../src/dto/create-estudiante.dto.js";
import { UpdateEstudianteDTO } from "../../src/dto/update-estudiante.dto.js";

const registerUserMock = jest.fn();
const loginUserMock = jest.fn();
const listarRolesMock = jest.fn();
const listarProfesionalesMock = jest.fn();
const obtenerMetricasMock = jest.fn();
const asignarRolMock = jest.fn();
const revocarRolMock = jest.fn();
const subirDocumentoMock = jest.fn();
const obtenerDocumentosPaginadosMock = jest.fn();

jest.unstable_mockModule("../../src/services/auth.service.js", () => ({
  AuthService: {
    registerUser: registerUserMock,
    loginUser: loginUserMock,
  },
}));

jest.unstable_mockModule("../../src/services/rol.service.js", () => ({
  listarRoles: listarRolesMock,
}));

jest.unstable_mockModule("../../src/services/funcionario.service.js", () => ({
  FuncionarioService: {
    listarProfesionales: listarProfesionalesMock,
  },
}));

jest.unstable_mockModule("../../src/services/dashboard.service.js", () => ({
  DashboardService: {
    obtenerMetricasGenerales: obtenerMetricasMock,
  },
}));

jest.unstable_mockModule("../../src/services/asignacion.service.js", () => ({
  asignarRol: asignarRolMock,
  revocarRol: revocarRolMock,
}));

jest.unstable_mockModule("../../src/repositories/documento.repository.js", () => ({
  DocumentoRepository: class DocumentoRepository {},
}));

jest.unstable_mockModule("../../src/services/documento.service.js", () => ({
  DocumentoService: class DocumentoService {
    subirDocumento = subirDocumentoMock;
    obtenerDocumentosPaginados = obtenerDocumentosPaginadosMock;
  },
}));

let register;
let login;
let listarRolesController;
let listarProfesionalesController;
let obtenerMetricasDashboard;
let asignarRolController;
let revocarRolController;
let subirDocumentoController;
let listarDocumentosController;

beforeAll(async () => {
  ({ register, login } = await import("../../src/controllers/auth.controller.js"));
  ({ listarRolesController } = await import("../../src/controllers/rol.controller.js"));
  ({ listarProfesionalesController } = await import("../../src/controllers/funcionario.controller.js"));
  ({ obtenerMetricasDashboard } = await import("../../src/controllers/dashboard.controller.js"));
  ({ asignarRolController, revocarRolController } = await import("../../src/controllers/asignacion.controller.js"));
  ({ subirDocumentoController, listarDocumentosController } = await import("../../src/controllers/documento.controller.js"));
});

describe("coverage boost - DTOs y controladores", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("LoginDTO valida y normaliza email y contraseña", () => {
    const dto = new LoginDTO({ email: "  TEST@EXAMPLE.COM  ", password: "secret" });

    expect(dto.email).toBe("test@example.com");
    expect(dto.password).toBe("secret");
  });

  test("LoginDTO falla cuando faltan email o contraseña", () => {
    expect(() => new LoginDTO({ email: "", password: "x" })).toThrow(
      "VALIDATION_ERROR: El email es obligatorio",
    );
    expect(() => new LoginDTO({ email: "a@test.com", password: "" })).toThrow(
      "VALIDATION_ERROR: La contraseña es obligatoria",
    );
  });

  test("RegisterDTO valida y rechaza formatos inválidos", () => {
    const dto = new RegisterDTO({
      nombre: " Ana ",
      email: "  ANA@TEST.COM  ",
      password: "123456",
      rut: "12345678-9",
    });

    expect(dto.nombre).toBe("Ana");
    expect(dto.email).toBe("ana@test.com");

    expect(() => new RegisterDTO({ nombre: "", email: "a@test.com", password: "x", rut: "1-9" })).toThrow(
      "VALIDATION_ERROR: El nombre es obligatorio",
    );
    expect(() => new RegisterDTO({ nombre: "Ana", email: "", password: "x", rut: "1-9" })).toThrow(
      "VALIDATION_ERROR: El email es obligatorio",
    );
    expect(() => new RegisterDTO({ nombre: "Ana", email: "bad-email", password: "x", rut: "1-9" })).toThrow(
      "VALIDATION_ERROR: El formato del email no es válido",
    );
    expect(() => new RegisterDTO({ nombre: "Ana", email: "a@test.com", password: "", rut: "1-9" })).toThrow(
      "VALIDATION_ERROR: La contraseña es obligatoria",
    );
    expect(() => new RegisterDTO({ nombre: "Ana", email: "a@test.com", password: "x", rut: "" })).toThrow(
      "VALIDATION_ERROR: El RUT es obligatorio",
    );
  });

  test("CreateCursoDTO valida campos obligatorios", () => {
    expect(
      () =>
        new CreateCursoDTO({
          nivel_educativo: "",
          nivel_curso: "Cuarto",
          letra: "A",
          id_profesor: 3,
        }),
    ).toThrow("VALIDATION_ERROR: El nivel educativo es obligatorio (ej: Básica, Media)");

    expect(
      () =>
        new CreateCursoDTO({
          nivel_educativo: "Media",
          nivel_curso: "",
          letra: "A",
          id_profesor: 3,
        }),
    ).toThrow("VALIDATION_ERROR: El nivel del curso es obligatorio (ej: Primero, Segundo)");

    expect(
      () =>
        new CreateCursoDTO({
          nivel_educativo: "Media",
          nivel_curso: "Cuarto",
          letra: "",
          id_profesor: 3,
        }),
    ).toThrow("VALIDATION_ERROR: La letra del curso es obligatoria (ej: A, B)");

    expect(
      () =>
        new CreateCursoDTO({
          nivel_educativo: "Media",
          nivel_curso: "Cuarto",
          letra: "A",
          id_profesor: 0,
        }),
    ).toThrow("VALIDATION_ERROR: Se debe asignar un ID de profesor al curso");
  });

  test("CreateEstudianteDTO valida los campos obligatorios", () => {
    expect(
      () =>
        new CreateEstudianteDTO({
          primer_nombre: "",
          primer_apellido: "Pérez",
          rut: "12345678-9",
          id_curso: 3,
          fecha_nacimiento: "2015-04-12",
          sexo: "Masculino",
        }),
    ).toThrow("VALIDATION_ERROR: El nombre es obligatorio");

    expect(
      () =>
        new CreateEstudianteDTO({
          primer_nombre: "Juan",
          primer_apellido: "",
          rut: "12345678-9",
          id_curso: 3,
          fecha_nacimiento: "2015-04-12",
          sexo: "Masculino",
        }),
    ).toThrow("VALIDATION_ERROR: El primer apellido es obligatorio");

    expect(
      () =>
        new CreateEstudianteDTO({
          primer_nombre: "Juan",
          primer_apellido: "Pérez",
          rut: "",
          id_curso: 3,
          fecha_nacimiento: "2015-04-12",
          sexo: "Masculino",
        }),
    ).toThrow("VALIDATION_ERROR: El RUT es obligatorio");
  });

  test("UpdateEstudianteDTO rechaza tipos inválidos y fechas erróneas", () => {
    expect(() => new UpdateEstudianteDTO({ primer_nombre: 123 })).toThrow(
      "VALIDATION_ERROR: primer_nombre debe ser string",
    );
    expect(() => new UpdateEstudianteDTO({ primer_apellido: 123 })).toThrow(
      "VALIDATION_ERROR: primer_apellido debe ser string",
    );
    expect(() => new UpdateEstudianteDTO({ sexo: 123 })).toThrow(
      "VALIDATION_ERROR: sexo debe ser string",
    );
    expect(() => new UpdateEstudianteDTO({ fecha_nacimiento: "fecha inválida" })).toThrow(
      "VALIDATION_ERROR: fecha_nacimiento inválida",
    );
    expect(() => new UpdateEstudianteDTO({ fecha_ingreso: "fecha inválida" })).toThrow(
      "VALIDATION_ERROR: fecha_ingreso inválida",
    );
    expect(() => new UpdateEstudianteDTO({ id_curso: "abc" })).toThrow(
      "VALIDATION_ERROR: id_curso debe ser entero",
    );
    expect(() => new UpdateEstudianteDTO({ es_nee: "si" })).toThrow(
      "VALIDATION_ERROR: es_nee debe ser boolean",
    );
  });

  test("auth.controller devuelve 400 para errores de validación y 500 para errores inesperados", async () => {
    registerUserMock.mockRejectedValue(new Error("VALIDATION_ERROR: datos inválidos"));
    const req = { body: { nombre: "Ana", email: "a@test.com", password: "123", rut: "12345678-9" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "datos inválidos" });

    loginUserMock.mockRejectedValue(new Error("VALIDATION_ERROR: datos inválidos"));
    await login({ body: { email: "a@test.com", password: "x" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);

    loginUserMock.mockRejectedValue(new Error("boom"));
    await login({ body: { email: "a@test.com", password: "x" } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("rol y funcionario y dashboard cubren rutas de error", async () => {
    listarRolesMock.mockRejectedValue(new Error("boom"));
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarRolesController({}, res);
    expect(res.status).toHaveBeenCalledWith(500);

    listarProfesionalesMock.mockRejectedValue(new Error("boom"));
    await listarProfesionalesController({}, res);
    expect(res.status).toHaveBeenCalledWith(500);

    obtenerMetricasMock.mockRejectedValue(new Error("boom"));
    await obtenerMetricasDashboard({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("asignacion.controller maneja errores de validación y revocación", async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    asignarRolMock.mockRejectedValue(new Error("falló"));
    await asignarRolController({ body: { idUsuarioDestino: 1, idRolAsignado: 2 }, user: { id_usuario: 3 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);

    revocarRolMock.mockRejectedValue(new Error("falló"));
    await revocarRolController({ params: { id: "1" }, user: { id_usuario: 3 } }, res);
    expect(res.status).toHaveBeenCalledWith(403);

    asignarRolMock.mockResolvedValue({ ok: true });
    await asignarRolController({ body: { idUsuarioDestino: 1, idRolAsignado: 2 }, user: { id_usuario: 3 } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("documento.controller cubre archivo faltante y paginación con error", async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await subirDocumentoController({ file: null, user: { id_usuario: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);

    obtenerDocumentosPaginadosMock.mockRejectedValue(new Error("error de paginación"));
    await listarDocumentosController({ query: { page: 1, limit: 5 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);

    obtenerDocumentosPaginadosMock.mockRejectedValue(new Error("boom"));
    await listarDocumentosController({ query: { page: 1, limit: 5 } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
