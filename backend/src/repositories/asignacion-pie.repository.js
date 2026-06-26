import prisma from "../config/prisma.js";

export class AsignacionPieRepository {
  async findActiveByStudent(idEstudiante, tx = prisma) {
    return tx.asignacion.findFirst({
      where: { id_estudiante: Number(idEstudiante) },
      include: {
        estudiante: true,
        funcionario: true,
      },
    });
  }

  async findActiveByStudentExcluding(idEstudiante, idAsignacion, tx = prisma) {
    return tx.asignacion.findFirst({
      where: {
        id_estudiante: Number(idEstudiante),
        NOT: { id_asignacion: Number(idAsignacion) },
      },
    });
  }

  async create({ idEstudiante, idFuncionario }, tx = prisma) {
    return tx.asignacion.create({
      data: {
        id_estudiante: Number(idEstudiante),
        id_funcionario: Number(idFuncionario),
      },
    });
  }

  async findAll(tx = prisma) {
    return tx.asignacion.findMany({
      include: {
        estudiante: true,
        funcionario: true,
      },
    });
  }

  async findById(idAsignacion, tx = prisma) {
    return tx.asignacion.findUnique({
      where: { id_asignacion: Number(idAsignacion) },
      include: {
        estudiante: true,
        funcionario: true,
      },
    });
  }

  async finalizar(idAsignacion, tx = prisma) {
    return tx.asignacion.delete({
      where: { id_asignacion: Number(idAsignacion) },
    });
  }
}
