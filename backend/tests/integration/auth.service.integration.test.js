import { jest } from "@jest/globals";

const bcryptMock = { hash: jest.fn(), compare: jest.fn() };
const jwtMock = { sign: jest.fn(() => "tok") };

const createRepoMock = () => ({ createUsuario: jest.fn(), findCuentaByEmail: jest.fn() });
const repoMock = createRepoMock();

jest.unstable_mockModule("bcrypt", () => ({ default: bcryptMock }));
jest.unstable_mockModule("jsonwebtoken", () => ({ default: jwtMock }));
jest.unstable_mockModule("../../src/repositories/auth.repository.js", () => ({
  AuthRepository: jest.fn().mockImplementation(() => repoMock),
}));

let AuthService;

beforeAll(async () => {
  ({ AuthService } = await import("../../src/services/auth.service.js"));
});

describe("AuthService integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcryptMock.hash.mockResolvedValue("hashed-password");
    bcryptMock.compare.mockResolvedValue(true);
  });

  test("registra un usuario y genera un hash para la contraseña", async () => {
    repoMock.createUsuario.mockResolvedValue({ id_usuario: 1 });

    const datos = { nombre: "Ana María López", email: "ana@example.com", password: "123456", rut: "12345678-9" };

    const result = await AuthService.registerUser(datos);

    expect(result).toEqual({ id_usuario: 1 });
    expect(repoMock.createUsuario).toHaveBeenCalledWith(expect.objectContaining({ rut: datos.rut, email: datos.email, contraseña: expect.any(String) }));
  });

  test("inicia sesión y devuelve un token cuando las credenciales son válidas", async () => {
    repoMock.findCuentaByEmail.mockResolvedValue({ id_usuario: 2, email: "juan@example.com", contraseña: "hashed-password", usuario: { primer_nombre: "Juan", primer_apellido: "Pérez", roles: [{ rol: { nombre_rol: "Directiva" } }] } });

    const result = await AuthService.loginUser({ email: "juan@example.com", password: "password123" });

    expect(result.token).toBeTruthy();
    expect(result.role).toBe("Directiva");
    expect(result.email).toBe("juan@example.com");
    expect(result.nombre).toBe("Juan Pérez");
  });
});
