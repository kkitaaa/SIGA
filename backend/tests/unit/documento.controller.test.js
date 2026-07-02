import { jest } from "@jest/globals";

const serviceMock = {
  subirDocumento: jest.fn(),
  obtenerDocumentosPaginados: jest.fn(),
};

jest.unstable_mockModule("../../src/services/documento.service.js", () => ({
  DocumentoService: jest.fn().mockImplementation(() => serviceMock),
}));

let subirDocumentoController;
let listarDocumentosController;

beforeAll(async () => {
  ({ subirDocumentoController, listarDocumentosController } =
    await import("../../src/controllers/documento.controller.js"));
});

describe("documento.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve 400 si no se adjunta archivo", async () => {
    const req = { file: null, user: { id_usuario: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await subirDocumentoController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      mensaje: "Debe adjuntar un archivo",
    });
  });

  test("sube documento y responde 201", async () => {
    serviceMock.subirDocumento.mockResolvedValue({ id_documento: 1 });
    const req = { file: { originalname: "a.pdf" }, user: { id_usuario: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await subirDocumentoController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      documento: { id_documento: 1 },
    });
  });

  test("lista documentos paginados", async () => {
    serviceMock.obtenerDocumentosPaginados.mockResolvedValue({
      documentos: [],
      total: 0,
    });
    const req = { query: { page: 2, limit: 5 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await listarDocumentosController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      documentos: [],
      total: 0,
    });
  });
});
