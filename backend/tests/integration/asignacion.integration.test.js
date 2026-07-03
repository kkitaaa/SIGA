import { jest } from "@jest/globals";

const repoMock = {
  verificarRolAdministrativo: jest.fn(),
  verificarRolDirectiva: jest.fn(),
  usuarioExiste: jest.fn(),
  rolExiste: jest.fn(),
  usuarioTieneRol: jest.fn(),
  cambiarRol: jest.fn(),
  revocarRol: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/repositories/asignacion.repository.js",
  () => ({ AsignacionRepository: jest.fn().mockImplementation(() => repoMock) }),
);

let asignarRol;
let revocarRol;

beforeAll(async () => {
  ({ asignarRol, revocarRol } =
    await import("../../src/services/asignacion.service.js"));
});

describe("Asignacion service integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("asigna un rol cuando el usuario actual tiene permisos y el rol existe", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.verificarRolDirectiva.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.rolExiste.mockResolvedValue({ nombre_rol: "Funcionario" });
    repoMock.usuarioTieneRol.mockResolvedValue(false);
    repoMock.cambiarRol.mockResolvedValue({ ok: true });

    await expect(asignarRol(2, "3", 1, 7)).resolves.toEqual({ ok: true });

    expect(repoMock.cambiarRol).toHaveBeenCalledWith(2, 3, 7);
  });

  test("rechaza asignación si el rol no es entero", async () => {
    await expect(asignarRol(2, "abc", 1, 7)).rejects.toThrow(
      "El id de rol debe ser un número entero",
    );
  });

  test("revoca un rol cuando existe y el usuario tiene permisos", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.usuarioTieneRol.mockResolvedValue({ id_rol: 3 });
    repoMock.revocarRol.mockResolvedValue({ ok: true });

    await expect(revocarRol(2, 1)).resolves.toEqual({ mensaje: "Rol revocado correctamente" });
  });
});
