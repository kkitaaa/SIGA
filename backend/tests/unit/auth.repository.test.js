import { jest } from "@jest/globals";

const prismaMock = {
  usuario: { create: jest.fn() },
  cuenta: { findUnique: jest.fn() },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

let AuthRepository;

beforeAll(async () => {
  ({ AuthRepository } = await import("../../src/repositories/auth.repository.js"));
});

describe("AuthRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("crea un usuario con su cuenta asociada", async () => {
    const repo = new AuthRepository();
    prismaMock.usuario.create.mockResolvedValue({ id_usuario: 1 });

    await expect(
      repo.createUsuario({
        rut: "12345678-9",
        primer_nombre: "Juan",
        primer_apellido: "Pérez",
        email: "juan@test.com",
        contraseña: "hash",
      }),
    ).resolves.toEqual({ id_usuario: 1 });

    expect(prismaMock.usuario.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ rut: "12345678-9" }),
    });
  });

  test("busca una cuenta por email con relaciones", async () => {
    const repo = new AuthRepository();
    prismaMock.cuenta.findUnique.mockResolvedValue({ id_usuario: 1 });

    await expect(repo.findCuentaByEmail("juan@test.com")).resolves.toEqual({ id_usuario: 1 });
    expect(prismaMock.cuenta.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "juan@test.com" } }),
    );
  });
});
