import prisma from "../config/prisma.js";

export class CursoRepository {
  static async findByDetalles(nivel_educativo, nivel_curso, letra) {
    return await prisma.curso.findFirst({
      where: {
        nivel_educativo,
        nivel_curso,
        letra,
      },
    });
  }

  static async findAll() {
    return await prisma.curso.findMany({
      include: {
        profesor: {
          include: {
            usuario: {
              select: { primer_nombre: true, primer_apellido: true },
            },
          },
        },
        _count: {
          select: { estudiantes: true },
        },
      },
    });
  }

  static async create(data) {
    return await prisma.curso.create({
      data: {
        nivel_educativo: data.nivel_educativo,
        nivel_curso: data.nivel_curso,
        letra: data.letra,
        id_profesor: data.id_profesor,
      },
    });
  }
}
