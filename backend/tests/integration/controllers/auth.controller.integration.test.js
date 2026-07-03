import { jest } from "@jest/globals";

const authServiceMock = {
  registerUser: jest.fn(),
  loginUser: jest.fn(),
};

jest.unstable_mockModule("../../../src/services/auth.service.js", () => ({
  AuthService: authServiceMock,
}));

let authController;

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
});

beforeAll(async () => {
  authController = await import("../../../src/controllers/auth.controller.js");
});

describe("Auth Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("register - success", async () => {
    authServiceMock.registerUser.mockResolvedValue({ primer_nombre: "Ana" });

    const req = {
      body: { nombre: "Ana", email: "ana@e.com", password: "123", rut: "1-9" },
    };
    const res = mockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensaje: "Usuario registrado con éxito" }),
    );
  });

  test("register - validation error returns 400", async () => {
    const req = { body: { nombre: "", email: "bad", password: "", rut: "" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("login - success", async () => {
    authServiceMock.loginUser.mockResolvedValue({
      token: "t",
      role: "Directiva",
      nombre: "Ana",
      email: "a@b",
      usuario: {},
    });

    const req = { body: { email: "a@b", password: "p" } };
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "t", role: "Directiva" }),
    );
  });

  test("login - invalid credentials returns 401", async () => {
    authServiceMock.loginUser.mockRejectedValue(
      new Error("CREDENCIALES_INVALIDAS"),
    );

    const req = { body: { email: "x", password: "y" } };
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("refresh - invalid token returns 400", async () => {
    authServiceMock.refreshToken = jest.fn().mockResolvedValue(null);

    const req = { cookies: {} };
    const res = mockResponse();

    await authController.refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "refreshToken requerido" });
  });
});
