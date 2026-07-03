import request from "supertest";
import app from "../../src/app.js";

describe("E2E Backend Tests", () => {
  test("Health endpoint returns status 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("SIGA backend corriendo correctamente");
  });

  test("Auth root route returns status 200", async () => {
    const response = await request(app).get("/api/auth");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Auth funcionando");
  });

  test("POST /api/auth/login returns 400 or 401 with missing credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({});
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test("POST /api/auth/login returns error with invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "noexiste@siga.cl", password: "badpassword" });
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test("POST /api/auth/register returns 400 for invalid payload", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ nombre: "", email: "invalid", password: "" });

    expect(response.status).toBe(400);
  });

  test("POST /api/auth/refresh without cookie returns 400", async () => {
    const response = await request(app).post("/api/auth/refresh");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "refreshToken requerido" });
  });

  test("POST /api/auth/logout without cookie returns 400", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "refreshToken requerido" });
  });

  test("GET /api/usuarios-sin-rol returns 401 without auth", async () => {
    const response = await request(app).get("/api/usuarios-sin-rol");
    expect(response.status).toBe(401);
  });

  test("GET /api/usuario/usuarios returns 401 without auth", async () => {
    const response = await request(app).get("/api/usuario/usuarios");
    expect(response.status).toBe(401);
  });

  test("GET /api/asignacion/roles returns 401 without auth", async () => {
    const response = await request(app).get("/api/asignacion/roles");
    expect(response.status).toBe(401);
  });

  test("GET /api/cursos returns 401 without auth", async () => {
    const response = await request(app).get("/api/cursos");
    expect(response.status).toBe(401);
  });

  test("GET /api/documentos returns 401 without auth", async () => {
    const response = await request(app).get("/api/documentos");
    expect(response.status).toBe(401);
  });

  test("GET /api/estudiantes returns 401 without auth", async () => {
    const response = await request(app).get("/api/estudiantes");
    expect(response.status).toBe(401);
  });

  test("GET /api/dashboard/profesor returns 401 without auth", async () => {
    const response = await request(app).get("/api/dashboard/profesor");
    expect(response.status).toBe(401);
  });

  test("GET /api/ruta-inexistente returns 404", async () => {
    const response = await request(app).get("/api/ruta-que-no-hemos-creado");
    expect(response.status).toBe(404);
  });
});
