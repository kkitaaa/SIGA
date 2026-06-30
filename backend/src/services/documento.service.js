import { StorageContext } from "../storage/storage-context.js";

export class DocumentoService {
  // APLICANDO DIP: Inyectamos el repositorio por el constructor
  constructor(documentoRepository) {
    this.repository = documentoRepository;
    this.storage = new StorageContext();
  }

  // Método original adaptado
  async subirDocumento(file, idUsuario) {
    const archivo = await this.storage.upload(file);

    // Usamos la abstracción del repositorio, no Prisma directamente
    return this.repository.crearDocumento({
      url: archivo.url,
      id_usuario: idUsuario,
    });
  }

  // Nuevo método de paginación
  async obtenerDocumentosPaginados(page = 1, limit = 10) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error("Los parámetros de paginación deben ser mayores a 0");
    }

    const skip = (pageNumber - 1) * limitNumber;

    const { documentos, total } = await this.repository.findAllPaginated(skip, limitNumber);

    return {
      documentos,
      paginacion: {
        totalDocumentos: total,
        paginaActual: pageNumber,
        totalPaginas: Math.ceil(total / limitNumber),
        limite: limitNumber
      }
    };
  }
}