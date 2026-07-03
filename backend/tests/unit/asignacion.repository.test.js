import { jest } from "@jest/globals";

const prismaMock = {
  usuario_rol: {
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

let AsignacionRepository;

beforeAll(async () => {
  ({ AsignacionRepository } =
    await import("../../src/repositories/asignacion.repository.js"));
});

describe("AsignacionRepository", () => {
  beforeEach(() => jest.clearAllMocks());

  test("revocarRol arroja error si no tiene rol asignado", async () => {
    prismaMock.usuario_rol.findFirst.mockResolvedValue(null);

    await expect(new AsignacionRepository().revocarRol(1)).rejects.toThrow(
      "El usuario no tiene un rol asignado",
    );
  });
});
