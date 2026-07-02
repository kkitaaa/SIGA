import prisma from "../config/prisma.js";

export class DocumentoRepository {
  // Método que ya tenías (ahora dentro de la clase)
  async crearDocumento(data) {
    return prisma.documento.create({
      data,
    });
  }

  // Nuevo método para listar con paginación
  async findAllPaginated(skip, take) {
    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        skip,
        take,
        // Ordenamos por los más recientes primero (ajusta 'id_documento' si usas 'fecha_subida')
        orderBy: { id_documento: "desc" },
      }),
      prisma.documento.count(),
    ]);

    return { documentos, total };
  }
}
