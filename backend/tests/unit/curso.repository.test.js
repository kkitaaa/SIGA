import { jest } from "@jest/globals";

const prismaMock = {
  curso: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

let CursoRepository;

beforeAll(async () => {
  ({ CursoRepository } =
    await import("../../src/repositories/curso.repository.js"));
});

describe("CursoRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("busca un curso por detalles", async () => {
    const repo = new CursoRepository();
    prismaMock.curso.findFirst.mockResolvedValue({ id_curso: 1 });

    await expect(repo.findByDetalles("Media", 4, "A")).resolves.toEqual({
      id_curso: 1,
    });
    expect(prismaMock.curso.findFirst).toHaveBeenCalledWith({
      where: { nivel_educativo: "Media", nivel_curso: 4, letra: "A" },
    });
  });

  test("lista cursos con relaciones", async () => {
    const repo = new CursoRepository();
    prismaMock.curso.findMany.mockResolvedValue([{ id_curso: 1 }]);

    await expect(repo.findAll()).resolves.toEqual([{ id_curso: 1 }]);
  });

  test("crea un curso", async () => {
    const repo = new CursoRepository();
    prismaMock.curso.create.mockResolvedValue({ id_curso: 2 });

    await expect(
      repo.create({
        nivel_educativo: "Media",
        nivel_curso: 4,
        letra: "B",
        id_profesor: 3,
      }),
    ).resolves.toEqual({ id_curso: 2 });
  });
});
