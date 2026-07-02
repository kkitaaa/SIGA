import { jest } from "@jest/globals";

const mockPrisma = {
  asignacion: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  estudiante: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  funcionario: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: mockPrisma,
}));

let AsignacionPieRepository;
let EstudianteRepository;
let FuncionarioRepository;

beforeAll(async () => {
  ({ AsignacionPieRepository } =
    await import("../../src/repositories/asignacion-pie.repository.js"));
  ({ EstudianteRepository } =
    await import("../../src/repositories/estudiante.repository.js"));
  ({ FuncionarioRepository } =
    await import("../../src/repositories/funcionario.repository.js"));
});

describe("repository branches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AsignacionPieRepository cubre todos los métodos con y sin transacción", async () => {
    const repo = new AsignacionPieRepository();
    const tx = { asignacion: mockPrisma.asignacion };

    mockPrisma.asignacion.findFirst.mockResolvedValue({ id: 1 });
    mockPrisma.asignacion.findMany.mockResolvedValue([{ id: 1 }]);
    mockPrisma.asignacion.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.asignacion.create.mockResolvedValue({ id: 1 });
    mockPrisma.asignacion.delete.mockResolvedValue({ id: 1 });

    await expect(repo.findActiveByStudent(2)).resolves.toEqual({ id: 1 });
    await expect(repo.findActiveByStudentExcluding(2, 5)).resolves.toEqual({
      id: 1,
    });
    await expect(
      repo.create({ idEstudiante: 2, idFuncionario: 5 }),
    ).resolves.toEqual({ id: 1 });
    await expect(repo.findAll()).resolves.toEqual([{ id: 1 }]);
    await expect(repo.findById(7)).resolves.toEqual({ id: 1 });
    await expect(repo.finalizar(7)).resolves.toEqual({ id: 1 });

    await expect(repo.findActiveByStudent(2, tx)).resolves.toEqual({ id: 1 });
    await expect(repo.findActiveByStudentExcluding(2, 5, tx)).resolves.toEqual({
      id: 1,
    });
    await expect(
      repo.create({ idEstudiante: 2, idFuncionario: 5 }, tx),
    ).resolves.toEqual({ id: 1 });
    await expect(repo.findAll(tx)).resolves.toEqual([{ id: 1 }]);
    await expect(repo.findById(7, tx)).resolves.toEqual({ id: 1 });
    await expect(repo.finalizar(7, tx)).resolves.toEqual({ id: 1 });
  });

  test("EstudianteRepository cubre métodos estáticos con y sin transacción", async () => {
    const tx = { estudiante: mockPrisma.estudiante };

    mockPrisma.estudiante.findFirst.mockResolvedValue({ rut: "123" });
    mockPrisma.estudiante.create.mockResolvedValue({ id: 1 });
    mockPrisma.estudiante.findMany.mockResolvedValue([{ id: 1 }]);
    mockPrisma.estudiante.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.estudiante.update.mockResolvedValue({ id: 1 });

    await expect(EstudianteRepository.findByRut("123")).resolves.toEqual({
      rut: "123",
    });
    await expect(
      EstudianteRepository.create({
        rut: "123",
        primer_nombre: "A",
        primer_apellido: "B",
        sexo: "M",
        fecha_nacimiento: "2020-01-01",
        fecha_ingreso: "2020-01-01",
        id_curso: 1,
      }),
    ).resolves.toEqual({ id: 1 });
    await expect(EstudianteRepository.findAll()).resolves.toEqual([{ id: 1 }]);
    await expect(EstudianteRepository.findAllNee()).resolves.toEqual([
      { id: 1 },
    ]);
    await expect(EstudianteRepository.findById(1)).resolves.toEqual({ id: 1 });
    await expect(
      EstudianteRepository.updateNeeStatus(1, true),
    ).resolves.toEqual({ id: 1 });
    await expect(
      EstudianteRepository.update(1, { es_nee: true }),
    ).resolves.toEqual({ id: 1 });

    await expect(EstudianteRepository.findById(1, tx)).resolves.toEqual({
      id: 1,
    });
    await expect(
      EstudianteRepository.updateNeeStatus(1, false, tx),
    ).resolves.toEqual({ id: 1 });
    await expect(
      EstudianteRepository.update(1, { es_nee: false }, tx),
    ).resolves.toEqual({ id: 1 });
  });

  test("FuncionarioRepository cubre métodos con y sin transacción", async () => {
    const repo = new FuncionarioRepository();
    const tx = { funcionario: mockPrisma.funcionario };

    mockPrisma.funcionario.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.funcionario.findMany.mockResolvedValue([{ id: 1 }]);

    await expect(repo.findPieMemberByUserId(1)).resolves.toEqual({ id: 1 });
    await expect(repo.findPieMemberByUserId(1, tx)).resolves.toEqual({ id: 1 });
    await expect(FuncionarioRepository.findAllFuncionarios()).resolves.toEqual([
      { id: 1 },
    ]);
  });
});
