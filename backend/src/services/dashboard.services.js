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
            tipo: {
              nombre_tipo: "PIE",
            },
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
