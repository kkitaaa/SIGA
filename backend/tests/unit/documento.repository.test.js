import { jest } from "@jest/globals";

const prismaMock = {
  documento: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({ default: prismaMock }));

let DocumentoRepository;

beforeAll(async () => {
  ({ DocumentoRepository } = await import("../../src/repositories/documento.repository.js"));
});

describe("DocumentoRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("crea un documento", async () => {
    const repo = new DocumentoRepository();
    prismaMock.documento.create.mockResolvedValue({ id_documento: 1 });

    await expect(repo.crearDocumento({ nombre: "a.pdf" })).resolves.toEqual({ id_documento: 1 });
  });

  test("lista documentos paginados y cuenta total", async () => {
    const repo = new DocumentoRepository();
    prismaMock.documento.findMany.mockResolvedValue([{ id_documento: 2 }]);
    prismaMock.documento.count.mockResolvedValue(1);

    await expect(repo.findAllPaginated(0, 10)).resolves.toEqual({ documentos: [{ id_documento: 2 }], total: 1 });
  });
});
