import { jest } from "@jest/globals";

const repoMock = {
  findByDetalles: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
};

jest.unstable_mockModule("../../src/repositories/curso.repository.js", () => ({
  CursoRepository: repoMock,
}));

let CursoService;

beforeAll(async () => {
  ({ CursoService } = await import("../../src/services/curso.service.js"));
});

describe("CursoService integration", () => {
  beforeEach(() => jest.clearAllMocks());

  test("crearCurso exitoso", async () => {
    repoMock.findByDetalles.mockResolvedValue(null);
    repoMock.create.mockResolvedValue({ id_curso: 1 });

    const service = new CursoService(repoMock);

    const res = await service.crearCurso({
      nivel_educativo: "Básico",
      nivel_curso: 1,
      letra: "A",
    });

    expect(res).toEqual({ id_curso: 1 });
    expect(repoMock.create).toHaveBeenCalled();
  });

  test("crearCurso falla si ya existe", async () => {
    repoMock.findByDetalles.mockResolvedValue({ id_curso: 2 });

    const service = new CursoService(repoMock);

    await expect(
      service.crearCurso({
        nivel_educativo: "Básico",
        nivel_curso: 1,
        letra: "A",
      }),
    ).rejects.toThrow(
      "BUSINESS_ERROR: Ya existe un curso registrado con este nivel y letra",
    );
  });

  test("obtenerCursoPorId falla si no existe", async () => {
    repoMock.findById.mockResolvedValue(null);
    const service = new CursoService(repoMock);

    await expect(service.obtenerCursoPorId(99)).rejects.toThrow(
      "Curso no encontrado",
    );
  });
});
