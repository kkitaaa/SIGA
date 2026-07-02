import { jest } from "@jest/globals";

const prismaMock = {
  estudiante: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({ default: prismaMock }));

let EstudianteRepository;

beforeAll(async () => {
  ({ EstudianteRepository } = await import("../../src/repositories/estudiante.repository.js"));
});

describe("EstudianteRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("busca estudiante por rut", async () => {
    prismaMock.estudiante.findFirst.mockResolvedValue({ id_estudiante: 1 });

    await expect(EstudianteRepository.findByRut("12345678-9")).resolves.toEqual({ id_estudiante: 1 });
  });

  test("crea un estudiante", async () => {
    prismaMock.estudiante.create.mockResolvedValue({ id_estudiante: 2 });

    await expect(EstudianteRepository.create({ rut: "11111111-1", primer_nombre: "Ana", primer_apellido: "Pérez", id_curso: 3 })).resolves.toEqual({ id_estudiante: 2 });
  });

  test("lista estudiantes y estudiantes NEE", async () => {
    prismaMock.estudiante.findMany.mockResolvedValue([{ id_estudiante: 1 }]);

    await expect(EstudianteRepository.findAll()).resolves.toEqual([{ id_estudiante: 1 }]);
    await expect(EstudianteRepository.findAllNee()).resolves.toEqual([{ id_estudiante: 1 }]);
  });

  test("actualiza estado NEE y datos de estudiante", async () => {
    prismaMock.estudiante.findUnique.mockResolvedValue({ id_estudiante: 1 });
    prismaMock.estudiante.update.mockResolvedValue({ id_estudiante: 1 });

    await expect(EstudianteRepository.findById(1, prismaMock)).resolves.toEqual({ id_estudiante: 1 });
    await expect(EstudianteRepository.updateNeeStatus(1, true, prismaMock)).resolves.toEqual({ id_estudiante: 1 });
    await expect(EstudianteRepository.update(1, { es_nee: false }, prismaMock)).resolves.toEqual({ id_estudiante: 1 });
  });
});
