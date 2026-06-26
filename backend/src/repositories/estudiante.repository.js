import prisma from "../config/prisma.js";

export class EstudianteRepository {
  static async findByRut(rut) {
    return await prisma.estudiante.findFirst({
      where: { rut },
    });
  }

  static async create(data) {
    return await prisma.estudiante.create({
      data: {
        rut: data.rut,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        sexo: data.sexo,
        fecha_nacimiento: data.fecha_nacimiento,
        fecha_ingreso: data.fecha_ingreso,
        id_curso: data.id_curso,
        es_nee: data.es_nee ?? false,
      },
    });
  }

  async findById(idEstudiante, tx = prisma) {
    return tx.estudiante.findUnique({
      where: {
        id_estudiante: Number(idEstudiante),
      },
    });
  }

  async updateNeeStatus(idEstudiante, esNee, tx = prisma) {
    return tx.estudiante.update({
      where: {
        id_estudiante: Number(idEstudiante),
      },
      data: {
        es_nee: esNee,
      },
    });
  }
}