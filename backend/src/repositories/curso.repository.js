import prisma from "../config/prisma.js";

export class CursoRepository {
  async findByDetalles(nivel_educativo, nivel_curso, letra) {
    return await prisma.curso.findFirst({
      where: {
        nivel_educativo,
        nivel_curso,
        letra,
      },
    });
  }

  async findAll() {
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

  async create(data) {
    return await prisma.curso.create({
      data: {
        nivel_educativo: data.nivel_educativo,
        nivel_curso: data.nivel_curso,
        letra: data.letra,
        id_profesor: data.id_profesor,
      },
    });
  }

  async findById(id_curso) {
    return await prisma.curso.findUnique({
      where: { 
        id_curso: Number(id_curso) 
      },
      include: { 
        estudiantes: true
      }
    });
  }
}