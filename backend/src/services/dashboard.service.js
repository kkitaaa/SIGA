import prisma from "../config/prisma.js";

export class DashboardService {
  static async obtenerMetricasGenerales() {
    // Las consultas se ejecutan de forma secuencial (una por una)
    // para no agotar las conexiones de la base de datos.
    const totalEstudiantes = await prisma.estudiante.count();

    const totalFuncionarios = await prisma.funcionario.count();

    const totalDocumentos = await prisma.documento.count();

    const totalPIE = await prisma.estudiante.count({
      where: {
        es_nee: true,
      },
    });

    return {
      estudiantes: totalEstudiantes,
      funcionarios: totalFuncionarios,
      documentos: totalDocumentos,
      pie: totalPIE,
    };
  }
}
