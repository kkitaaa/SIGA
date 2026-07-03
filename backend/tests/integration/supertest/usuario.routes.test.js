import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const controllerMock = {
  listarUsuariosSinRolController: jest.fn(async (req, res) =>
    res.status(200).json({ ok: true, usuarios: [{ id_usuario: 1 }] }),
  ),
  listarUsuariosController: jest.fn(async (req, res) =>
    res.status(200).json({ ok: true, usuarios: [{ id_usuario: 2 }] }),
  ),
};

jest.unstable_mockModule("../../../src/middleware/auth.js", () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id_usuario: 1 };
    next();
  },
}));

jest.unstable_mockModule("../../../src/middleware/role.middleware.js", () => ({
  verifyRole: () => async (req, res, next) => next(),
}));

jest.unstable_mockModule(
  "../../../src/controllers/usuario.controller.js",
  () => ({
    listarUsuariosSinRolController:
      controllerMock.listarUsuariosSinRolController,
    listarUsuariosController: controllerMock.listarUsuariosController,
  }),
);

let usuarioRoutes;

beforeAll(async () => {
  usuarioRoutes = (await import("../../../src/routes/usuario.routes.js"))
    .default;
});

describe("Usuario routes (supertest)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function buildApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/usuario", usuarioRoutes);
    return app;
  }

  test("GET /api/usuario/usuarios-sin-rol devuelve 200 y usuarios", async () => {
    const app = buildApp();
    const response = await request(app).get("/api/usuario/usuarios-sin-rol");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, usuarios: [{ id_usuario: 1 }] });
    expect(controllerMock.listarUsuariosSinRolController).toHaveBeenCalled();
  });

  test("GET /api/usuario/usuarios devuelve 200 y usuarios", async () => {
    const app = buildApp();
    const response = await request(app).get("/api/usuario/usuarios");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, usuarios: [{ id_usuario: 2 }] });
    expect(controllerMock.listarUsuariosController).toHaveBeenCalled();
  });
});
