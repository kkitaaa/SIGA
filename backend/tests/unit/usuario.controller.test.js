import { jest } from "@jest/globals";

const serviceMock = {
  obtenerUsuariosSinRol: jest.fn(),
  obtenerUsuariosConRol: jest.fn(),
};

jest.unstable_mockModule("../../src/services/usuario.service.js", () => ({
  UsuarioService: serviceMock,
}));

let listarUsuariosSinRolController;
let listarUsuariosController;

beforeAll(async () => {
  ({ listarUsuariosSinRolController, listarUsuariosController } =
    await import("../../src/controllers/usuario.controller.js"));
});

describe("usuario.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listarUsuariosSinRolController responde 200 con usuarios", async () => {
    const usuarios = [{ id_usuario: 1 }];
    serviceMock.obtenerUsuariosSinRol.mockResolvedValue(usuarios);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarUsuariosSinRolController({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true, usuarios });
  });

  test("listarUsuariosSinRolController responde 500 en error inesperado", async () => {
    serviceMock.obtenerUsuariosSinRol.mockRejectedValue(new Error("falló"));
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarUsuariosSinRolController({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, mensaje: "falló" });
  });

  test("listarUsuariosController responde 200 con mensaje cuando no hay usuarios", async () => {
    serviceMock.obtenerUsuariosConRol.mockResolvedValue([]);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarUsuariosController({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      usuarios: [],
      mensaje: "No hay usuarios registrados",
    });
  });

  test("listarUsuariosController responde 200 con usuarios", async () => {
    const usuarios = [{ id_usuario: 2 }];
    serviceMock.obtenerUsuariosConRol.mockResolvedValue(usuarios);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarUsuariosController({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true, usuarios });
  });

  test("listarUsuariosController responde 500 en error inesperado", async () => {
    serviceMock.obtenerUsuariosConRol.mockRejectedValue(new Error("boom"));
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarUsuariosController({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      mensaje: "Error del servidor",
    });
  });
});
