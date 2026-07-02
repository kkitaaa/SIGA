import { jest } from "@jest/globals";

const prismaMock = {
  rol: { findMany: jest.fn() },
  usuario_rol: { findFirst: jest.fn() },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

let RolRepository;

beforeAll(async () => {
  ({ RolRepository } =
    await import("../../src/repositories/rol.repository.js"));
});

describe("RolRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lista los roles disponibles", async () => {
    const repo = new RolRepository();
    prismaMock.rol.findMany.mockResolvedValue([{ id_rol: 1 }]);

    await expect(repo.findAllRoles()).resolves.toEqual([{ id_rol: 1 }]);
  });

  test("consulta si un usuario tiene un rol específico", async () => {
    const repo = new RolRepository();
    prismaMock.usuario_rol.findFirst.mockResolvedValue({ id_rol: 2 });

    await expect(repo.usuarioTieneRol(7, "Directiva")).resolves.toEqual({
      id_rol: 2,
    });
  });
});
