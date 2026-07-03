import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const serviceMock = { asignarRol: jest.fn(), revocarRol: jest.fn() };

jest.unstable_mockModule("../../../src/services/asignacion.service.js", () => ({
  asignarRol: serviceMock.asignarRol,
  revocarRol: serviceMock.revocarRol,
}));

jest.unstable_mockModule("../../../src/middleware/auth.js", () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id_usuario: 1 };
    return next();
  },
}));

let asignacionRoutes;

beforeAll(async () => {
  asignacionRoutes = (await import("../../../src/routes/asignacion.routes.js"))
    .default;
});

describe("Asignacion routes (supertest)", () => {
  beforeEach(() => jest.clearAllMocks());

  function buildApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/asignacion", asignacionRoutes);
    return app;
  }

  test("POST /api/asignacion -> 200", async () => {
    serviceMock.asignarRol.mockResolvedValue({ ok: true });

    const app = buildApp();

    const res = await request(app)
      .post("/api/asignacion")
      .send({ idUsuarioDestino: 2, idRolAsignado: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
  });

  test("DELETE /api/asignacion/revocar-rol/:idUsuario -> 200", async () => {
    serviceMock.revocarRol.mockResolvedValue({ mensaje: "Revocado" });

    const app = buildApp();

    const res = await request(app).delete("/api/asignacion/revocar-rol/2");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
  });
});
