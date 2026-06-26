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
        edad: data.edad,
        sexo: data.sexo,
        ano_nacimiento: data.ano_nacimiento,
        mes_nacimiento: data.mes_nacimiento,
        dia_nacimiento: data.dia_nacimiento,
        fecha_ingreso: data.fecha_ingreso,
        id_usuario: data.id_usuario,
        id_curso: data.id_curso,
        id_tipo: data.id_tipo,
      },
    });
  }
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
