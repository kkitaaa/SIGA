import { jest } from "@jest/globals";

const asignarRolMock = jest.fn();
const revocarRolMock = jest.fn();

jest.unstable_mockModule("../../src/services/asignacion.service.js", () => ({
  asignarRol: asignarRolMock,
  revocarRol: revocarRolMock,
}));

let asignarRolController;
let revocarRolController;

beforeAll(async () => {
  ({ asignarRolController, revocarRolController } = await import("../../src/controllers/asignacion.controller.js"));
});

describe("asignacion.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("asigna un rol y responde 200", async () => {
    asignarRolMock.mockResolvedValue({ ok: true });
    const req = {
      body: { idUsuarioDestino: 2, idRolAsignado: 3 },
      user: { id_usuario: 1 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await asignarRolController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("revoca un rol y responde 200", async () => {
    revocarRolMock.mockResolvedValue({ mensaje: "Rol revocado correctamente" });
    const req = { params: { idUsuario: "2" }, user: { id_usuario: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await revocarRolController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
