import { jest } from "@jest/globals";

const obtenerMetricasMock = jest.fn();

jest.unstable_mockModule("../../src/services/dashboard.service.js", () => ({
  DashboardService: {
    obtenerMetricasGenerales: obtenerMetricasMock,
  },
}));

let obtenerMetricasDashboard;

beforeAll(async () => {
  ({ obtenerMetricasDashboard } = await import("../../src/controllers/dashboard.controller.js"));
});

describe("dashboard.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("obtiene métricas del dashboard", async () => {
    obtenerMetricasMock.mockResolvedValue({ estudiantes: 1 });
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await obtenerMetricasDashboard({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
