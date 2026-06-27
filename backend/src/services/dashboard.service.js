import prisma from "../config/prisma.js";

export class DashboardService {
  static async obtenerMetricasGenerales() {
    const [totalEstudiantes, totalFuncionarios, totalDocumentos, totalPIE] =
      await Promise.all([
        prisma.estudiante.count(),
        prisma.funcionario.count(),
        prisma.documento.count(),
        prisma.estudiante.count({
          where: {
            es_nee: true,
          },
        }),
      ]);

    return {
      estudiantes: totalEstudiantes,
      funcionarios: totalFuncionarios,
      documentos: totalDocumentos,
      pie: totalPIE,
    };
  }
}
