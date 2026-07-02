import prisma from "../config/prisma.js";

export class DocumentoRepository {
  async crearDocumento(data) {
    return prisma.documento.create({
      data,
    });
  }

  async findAllPaginated(skip, take) {
    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        skip,
        take,
        orderBy: { id_documento: "desc" },
      }),
      prisma.documento.count(),
    ]);

    return { documentos, total };
  }
}
