import { jest } from "@jest/globals";

const serviceMock = {
  registerUser: jest.fn(),
  loginUser: jest.fn(),
};

jest.unstable_mockModule("../../src/services/auth.service.js", () => ({
  AuthService: serviceMock,
}));

let register;
let login;

beforeAll(async () => {
  ({ register, login } = await import("../../src/controllers/auth.controller.js"));
});

describe("auth.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registra usuario con 201", async () => {
    serviceMock.registerUser.mockResolvedValue({ primer_nombre: "Ana" });
    const req = { body: { nombre: "Ana Pérez", email: "ana@test.com", password: "123", rut: "12345678-9" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("retorna 401 en login con credenciales inválidas", async () => {
    serviceMock.loginUser.mockRejectedValue(new Error("CREDENCIALES_INVALIDAS"));
    const req = { body: { email: "a@test.com", password: "x" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
