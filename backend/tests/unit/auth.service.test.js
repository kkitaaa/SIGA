import { jest } from "@jest/globals";

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const createRepoMock = () => ({
  createUsuario: jest.fn(),
  findCuentaByEmail: jest.fn(),
});

const repoMock = createRepoMock();

jest.unstable_mockModule("bcrypt", () => ({
  default: bcryptMock,
}));

jest.unstable_mockModule("../../src/repositories/auth.repository.js", () => ({
  AuthRepository: jest.fn().mockImplementation(() => repoMock),
}));

let AuthService;

beforeAll(async () => {
  ({ AuthService } = await import("../../src/services/auth.service.js"));
});

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcryptMock.hash.mockResolvedValue("hashed-password");
    bcryptMock.compare.mockResolvedValue(true);
  });

  test("registra un usuario y genera un hash para la contraseña", async () => {
    repoMock.createUsuario.mockResolvedValue({ id_usuario: 1 });

    const datos = {
      nombre: "Ana María López",
      email: "ana@example.com",
      password: "123456",
      rut: "12345678-9",
    };

    const result = await AuthService.registerUser(datos);

    expect(result).toEqual({ id_usuario: 1 });
    expect(repoMock.createUsuario).toHaveBeenCalledWith(
      expect.objectContaining({
        rut: datos.rut,
        email: datos.email,
        contraseña: expect.any(String),
      }),
    );
  });

  test("inicia sesión y devuelve un token cuando las credenciales son válidas", async () => {
    repoMock.findCuentaByEmail.mockResolvedValue({
      id_usuario: 2,
      email: "juan@example.com",
      contraseña: "hashed-password",
      usuario: {
        primer_nombre: "Juan",
        primer_apellido: "Pérez",
        roles: [{ rol: { nombre_rol: "Directiva" } }],
      },
    });

    const result = await AuthService.loginUser({
      email: "juan@example.com",
      password: "password123",
    });

    expect(result.token).toBeTruthy();
    expect(result.role).toBe("Directiva");
    expect(result.email).toBe("juan@example.com");
    expect(result.nombre).toBe("Juan Pérez");
  });

  test("rechaza el login cuando no existe la cuenta", async () => {
    repoMock.findCuentaByEmail.mockResolvedValue(null);

    await expect(
      AuthService.loginUser({ email: "nada@example.com", password: "x" }),
    ).rejects.toThrow("CREDENCIALES_INVALIDAS");
  });

  test("rechaza el login cuando la contraseña no coincide", async () => {
    bcryptMock.compare.mockResolvedValue(false);
    repoMock.findCuentaByEmail.mockResolvedValue({
      id_usuario: 3,
      email: "maria@example.com",
      contraseña: "hashed-password",
      usuario: {
        primer_nombre: "María",
        primer_apellido: "Gómez",
        roles: [],
      },
    });

    await expect(
      AuthService.loginUser({ email: "maria@example.com", password: "wrong" }),
    ).rejects.toThrow("CREDENCIALES_INVALIDAS");
  });
});
