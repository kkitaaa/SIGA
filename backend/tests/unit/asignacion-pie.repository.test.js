import { jest } from "@jest/globals";

const txMock = {
  asignacion: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const prismaMock = { asignacion: txMock.asignacion };

jest.unstable_mockModule("../../src/config/prisma.js", () => ({ default: prismaMock }));

let AsignacionPieRepository;

beforeAll(async () => {
  ({ AsignacionPieRepository } = await import("../../src/repositories/asignacion-pie.repository.js"));
});

describe("AsignacionPieRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("busca una asignación activa por estudiante", async () => {
    const repo = new AsignacionPieRepository();
    txMock.asignacion.findFirst.mockResolvedValue({ id_asignacion: 1 });

    await expect(repo.findActiveByStudent(10, txMock)).resolves.toEqual({ id_asignacion: 1 });
    expect(txMock.asignacion.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id_estudiante: 10 } }));
  });

  test("crea una asignación PIE", async () => {
    const repo = new AsignacionPieRepository();
    txMock.asignacion.create.mockResolvedValue({ id_asignacion: 2 });

    await expect(repo.create({ idEstudiante: 10, idFuncionario: 3 }, txMock)).resolves.toEqual({ id_asignacion: 2 });
  });

  test("lista asignaciones y las obtiene por id", async () => {
    const repo = new AsignacionPieRepository();
    txMock.asignacion.findMany.mockResolvedValue([{ id_asignacion: 1 }]);
    txMock.asignacion.findUnique.mockResolvedValue({ id_asignacion: 1 });

    await expect(repo.findAll(txMock)).resolves.toEqual([{ id_asignacion: 1 }]);
    await expect(repo.findById(1, txMock)).resolves.toEqual({ id_asignacion: 1 });
  });

  test("finaliza una asignación", async () => {
    const repo = new AsignacionPieRepository();
    txMock.asignacion.delete.mockResolvedValue({ ok: true });

    await expect(repo.finalizar(1, txMock)).resolves.toEqual({ ok: true });
  });
});
