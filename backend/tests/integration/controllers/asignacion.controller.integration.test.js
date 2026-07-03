import { jest } from "@jest/globals";

const serviceMock = {
  asignarRol: jest.fn(),
  revocarRol: jest.fn(),
};

jest.unstable_mockModule("../../../src/services/asignacion.service.js", () => ({
  asignarRol: serviceMock.asignarRol,
  revocarRol: serviceMock.revocarRol,
}));

let asignacionController;

beforeAll(async () => {
  asignacionController = await import("../../../src/controllers/asignacion.controller.js");
});

describe("Asignacion Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("asignarRolController - missing fields returns 400", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await asignacionController.asignarRolController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("asignarRolController - success", async () => {
    serviceMock.asignarRol.mockResolvedValue({ ok: true });

    const req = { body: { idUsuarioDestino: 2, idRolAsignado: 3 }, user: { id_usuario: 5 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await asignacionController.asignarRolController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  test("revocarRolController - success", async () => {
    serviceMock.revocarRol.mockResolvedValue({ mensaje: "Revocado" });

    const req = { params: { idUsuario: 2 }, user: { id_usuario: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await asignacionController.revocarRolController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  test("revocarRolController - error returns 403", async () => {
    serviceMock.revocarRol.mockRejectedValue(new Error("No permiso"));

    const req = { params: { idUsuario: 2 }, user: { id_usuario: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await asignacionController.revocarRolController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
