import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const authServiceMock = { registerUser: jest.fn(), loginUser: jest.fn() };

jest.unstable_mockModule("../../../src/services/auth.service.js", () => ({ AuthService: authServiceMock }));

let authRoutes;

beforeAll(async () => {
  authRoutes = (await import("../../../src/routes/auth.routes.js")).default;
});

describe("Auth routes (supertest)", () => {
  beforeEach(() => jest.clearAllMocks());

  function buildApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);
    return app;
  }

  test("POST /api/auth/register -> 201", async () => {
    authServiceMock.registerUser.mockResolvedValue({ primer_nombre: "Ana" });

    const app = buildApp();

    const res = await request(app).post("/api/auth/register").send({ nombre: "Ana", email: "a@b.com", password: "p", rut: "1-9" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("mensaje");
  });

  test("POST /api/auth/login -> 200", async () => {
    authServiceMock.loginUser.mockResolvedValue({ token: "t", role: "Directiva", nombre: "Ana", email: "a@b" });

    const app = buildApp();

    const res = await request(app).post("/api/auth/login").send({ email: "a@b", password: "p" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
