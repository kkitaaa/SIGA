import prisma from "../config/prisma.js";

export class EstudianteRepository {
  async findById(idEstudiante, tx = prisma) {
    return tx.estudiante.findUnique({
      where: { id_estudiante: Number(idEstudiante) },
      include: {
        usuario: {
          include: {
            cuenta: true,
          },
        },
      },
    });
  }

  async updateNeeStatus(idEstudiante, esNee, tx = prisma) {
    return tx.estudiante.findUnique({
      where: { id_estudiante: Number(idEstudiante) },
    });
  }
}
