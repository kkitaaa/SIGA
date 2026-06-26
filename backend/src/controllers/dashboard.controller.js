import { DashboardService } from "../services/dashboard.service.js";

export const obtenerMetricasDashboard = async (req, res) => {
  try {
    const metricas = await DashboardService.obtenerMetricasGenerales();

    res.status(200).json(metricas);
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    res
      .status(500)
      .json({ error: "Error interno al cargar las métricas del dashboard" });
  }
};
