import { jest } from "@jest/globals";

const prismaMock = {
  funcionario: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({ default: prismaMock }));

let FuncionarioRepository;

beforeAll(async () => {
  ({ FuncionarioRepository } = await import("../../src/repositories/funcionario.repository.js"));
});

describe("FuncionarioRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("busca funcionario por id de usuario", async () => {
    const repo = new FuncionarioRepository();
    prismaMock.funcionario.findUnique.mockResolvedValue({ id_funcionario: 2 });

    await expect(repo.findPieMemberByUserId(2, prismaMock)).resolves.toEqual({ id_funcionario: 2 });
  });

  test("lista funcionarios con relaciones", async () => {
    prismaMock.funcionario.findMany.mockResolvedValue([{ id_funcionario: 1 }]);

    await expect(FuncionarioRepository.findAllFuncionarios()).resolves.toEqual([{ id_funcionario: 1 }]);
  });
});
