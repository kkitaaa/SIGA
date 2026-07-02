import { jest } from "@jest/globals";

const repoMock = {
  verificarRolAdministrativo: jest.fn(),
  usuarioExiste: jest.fn(),
  rolExiste: jest.fn(),
  usuarioTieneRol: jest.fn(),
  asignarRol: jest.fn(),
  revocarRol: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/repositories/asignacion.repository.js",
  () => ({
    AsignacionRepository: jest.fn().mockImplementation(() => repoMock),
  }),
);

let asignarRol;
let revocarRol;

beforeAll(async () => {
  ({ asignarRol, revocarRol } =
    await import("../../src/services/asignacion.service.js"));
});

describe("asignacion.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("asigna un rol cuando el usuario actual tiene permisos y el rol existe", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.rolExiste.mockResolvedValue({ nombre_rol: "Funcionario" });
    repoMock.usuarioTieneRol.mockResolvedValue(false);
    repoMock.asignarRol.mockResolvedValue({ ok: true });

    await expect(asignarRol(2, "3", 1, 7)).resolves.toEqual({ ok: true });

    expect(repoMock.asignarRol).toHaveBeenCalledWith(2, 3, 7);
  });

  test("rechaza asignación si el rol no es entero", async () => {
    await expect(asignarRol(2, "abc", 1, 7)).rejects.toThrow(
      "El id de rol debe ser un número entero",
    );
  });

  test("rechaza asignación si el usuario actual no es administrativo", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue(null);

    await expect(asignarRol(2, 3, 1, 7)).rejects.toThrow(
      "No tienes permisos para asignar roles",
    );
  });

  test("rechaza asignación si el usuario no existe", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(false);

    await expect(asignarRol(2, 3, 1, 7)).rejects.toThrow(
      "El usuario no existe",
    );
  });

  test("rechaza asignación si el rol no existe", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.rolExiste.mockResolvedValue(null);

    await expect(asignarRol(2, 3, 1, 7)).rejects.toThrow("El rol no existe");
  });

  test("rechaza asignación si el usuario ya tiene un rol", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.rolExiste.mockResolvedValue({ nombre_rol: "Estudiante" });
    repoMock.usuarioTieneRol.mockResolvedValue(true);

    await expect(asignarRol(2, 3, 1, 7)).rejects.toThrow(
      "El usuario ya tiene un rol asignado",
    );
  });

  test("requiere tipo de funcionario cuando el rol es Funcionario", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.rolExiste.mockResolvedValue({ nombre_rol: "Funcionario" });
    repoMock.usuarioTieneRol.mockResolvedValue(false);

    await expect(asignarRol(2, 3, 1, undefined)).rejects.toThrow(
      "Debe especificar el tipo de funcionario (especialidad)",
    );
  });

  test("revoca un rol cuando existe y el usuario tiene permisos", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.usuarioTieneRol.mockResolvedValue({ id_rol: 3 });
    repoMock.revocarRol.mockResolvedValue({ ok: true });

    await expect(revocarRol(2, 1)).resolves.toEqual({
      mensaje: "Rol revocado correctamente",
    });
  });

  test("rechaza revocación si el usuario no tiene rol asignado", async () => {
    repoMock.verificarRolAdministrativo.mockResolvedValue({ id_usuario: 1 });
    repoMock.usuarioExiste.mockResolvedValue(true);
    repoMock.usuarioTieneRol.mockResolvedValue(null);

    await expect(revocarRol(2, 1)).rejects.toThrow(
      "El usuario no tiene un rol asignado",
    );
  });
});
