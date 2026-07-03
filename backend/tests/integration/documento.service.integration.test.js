import { jest } from "@jest/globals";

const storageMock = { upload: jest.fn() };
const repoMock = { crearDocumento: jest.fn(), findAllPaginated: jest.fn() };

jest.unstable_mockModule("../../src/storage/storage-context.js", () => ({
  StorageContext: function () {
    return storageMock;
  },
}));

let DocumentoService;

beforeAll(async () => {
  const mod = await import("../../src/services/documento.service.js");
  DocumentoService = mod.DocumentoService;
});

describe("DocumentoService integration", () => {
  beforeEach(() => jest.clearAllMocks());

  test("subirDocumento usa storage y crea documento", async () => {
    storageMock.upload.mockResolvedValue({ url: "http://file" });
    repoMock.crearDocumento.mockResolvedValue({ id_documento: 1, url: "http://file" });

    const service = new DocumentoService(repoMock);

    const res = await service.subirDocumento({ buffer: "x" }, "nombre", 5);

    expect(storageMock.upload).toHaveBeenCalled();
    expect(repoMock.crearDocumento).toHaveBeenCalledWith({ nombre: "nombre", url: "http://file", id_usuario: 5 });
    expect(res).toEqual({ id_documento: 1, url: "http://file" });
  });

  test("obtenerDocumentosPaginados valida parámetros y retorna paginación", async () => {
    repoMock.findAllPaginated.mockResolvedValue({ documentos: [{ id: 1 }], total: 3 });

    const service = new DocumentoService(repoMock);

    const res = await service.obtenerDocumentosPaginados(1, 2);

    expect(res.documentos).toHaveLength(1);
    expect(res.paginacion.totalPaginas).toBe(Math.ceil(3 / 2));
  });

  test("obtenerDocumentosPaginados lanza error en parámetros inválidos", async () => {
    const service = new DocumentoService(repoMock);

    await expect(service.obtenerDocumentosPaginados(0, 10)).rejects.toThrow(
      "Los parámetros de paginación deben ser mayores a 0",
    );
  });
});
