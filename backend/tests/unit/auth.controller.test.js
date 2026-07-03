import { jest } from "@jest/globals";

const serviceMock = {
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  refreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
};

jest.unstable_mockModule("../../src/services/auth.service.js", () => ({
  AuthService: serviceMock,
}));

let register;
let login;
let refresh;
let logout;

beforeAll(async () => {
  ({ register, login, refresh, logout } =
    await import("../../src/controllers/auth.controller.js"));
});

describe("auth.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  });

  test("registra usuario con 201", async () => {
    serviceMock.registerUser.mockResolvedValue({ primer_nombre: "Ana" });
    const req = {
      body: {
        nombre: "Ana Pérez",
        email: "ana@test.com",
        password: "123",
        rut: "12345678-9",
      },
    };
    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("retorna 401 en login con credenciales inválidas", async () => {
    serviceMock.loginUser.mockRejectedValue(
      new Error("CREDENCIALES_INVALIDAS"),
    );
    const req = { body: { email: "a@test.com", password: "x" } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("logout sin cookie devuelve 400", async () => {
    const req = { cookies: {} };
    const res = mockResponse();

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "refreshToken requerido" });
  });

  test("logout con cookie invoca revokeRefreshToken y borra cookie", async () => {
    serviceMock.revokeRefreshToken = jest.fn().mockResolvedValue({});
    const req = { cookies: { refreshToken: "valid-refresh" } };
    const res = mockResponse();

    await logout(req, res);

    expect(serviceMock.revokeRefreshToken).toHaveBeenCalledWith(
      "valid-refresh",
    );
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", { path: "/" });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
