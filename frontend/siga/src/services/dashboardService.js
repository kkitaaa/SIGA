import api from "./api";

export const dashboardService = {
  async getMetrics() {
    const { data } = await api.get("/dashboard");
    return data;
  },
};
