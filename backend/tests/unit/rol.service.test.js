import { jest } from "@jest/globals";

const repoMock = {
  findAllRoles: jest.fn(),
  usuarioTieneRol: jest.fn(),
};

jest.unstable_mockModule("../../src/repositories/rol.repository.js", () => ({
  RolRepository: jest.fn().mockImplementation(() => repoMock),
}));

let listarRoles;
let verificarRolUsuario;

beforeAll(async () => {
  ({ listarRoles, verificarRolUsuario } =
    await import("../../src/services/rol.service.js"));
});

describe("rol.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lista roles delegando al repositorio", async () => {
    repoMock.findAllRoles.mockResolvedValue([{ id_rol: 1 }]);
    await expect(listarRoles()).resolves.toEqual([{ id_rol: 1 }]);
  });

  test("verifica si un usuario tiene el rol requerido", async () => {
    repoMock.usuarioTieneRol.mockResolvedValue({ id_usuario: 2 });
    await expect(verificarRolUsuario(2, "Directiva")).resolves.toEqual({
      id_usuario: 2,
    });
  });
});
