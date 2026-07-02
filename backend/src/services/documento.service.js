import { StorageContext } from "../storage/storage-context.js";

export class DocumentoService {
  constructor(documentoRepository) {
    this.repository = documentoRepository;
    this.storage = new StorageContext();
  }

  async subirDocumento(file, nombre, idUsuario) {
    const archivo = await this.storage.upload(file);

    return this.repository.crearDocumento({
      nombre: nombre,
      url: archivo.url,
      id_usuario: idUsuario,
    });
  }

  async obtenerDocumentosPaginados(page = 1, limit = 10) {
    const pageNumber = Number.parseInt(page, 10);
    const limitNumber = Number.parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error("Los parámetros de paginación deben ser mayores a 0");
    }

    const skip = (pageNumber - 1) * limitNumber;

    const { documentos, total } = await this.repository.findAllPaginated(
      skip,
      limitNumber,
    );

    return {
      documentos,
      paginacion: {
        totalDocumentos: total,
        paginaActual: pageNumber,
        totalPaginas: Math.ceil(total / limitNumber),
        limite: limitNumber,
      },
    };
  }
}
