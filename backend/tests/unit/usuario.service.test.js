import { jest } from "@jest/globals";

const repoMock = {
  findUsuariosSinRol: jest.fn(),
  findAllConRol: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/repositories/usuario.repository.js",
  () => ({
    UsuarioRepository: jest.fn().mockImplementation(() => repoMock),
  }),
);

let UsuarioService;

beforeAll(async () => {
  ({ UsuarioService } = await import("../../src/services/usuario.service.js"));
});

describe("UsuarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("obtenerUsuariosSinRol delega al repositorio", async () => {
    const usuarios = [{ id_usuario: 1, primer_nombre: "Ana" }];
    repoMock.findUsuariosSinRol.mockResolvedValue(usuarios);

    await expect(UsuarioService.obtenerUsuariosSinRol()).resolves.toEqual(
      usuarios,
    );

    expect(repoMock.findUsuariosSinRol).toHaveBeenCalledTimes(1);
  });

  test("obtenerUsuariosConRol formatea los datos correctamente", async () => {
    const usuarios = [
      {
        id_usuario: 2,
        primer_nombre: "Juan",
        primer_apellido: "Pérez",
        cuenta: { email: "juan@test.com" },
        roles: [{ rol: { nombre_rol: "Coordinador Administrativo" } }],
      },
    ];
    repoMock.findAllConRol.mockResolvedValue(usuarios);

    await expect(UsuarioService.obtenerUsuariosConRol()).resolves.toEqual([
      {
        id_usuario: 2,
        nombre: "Juan Pérez",
        correo: "juan@test.com",
        rol: "Coordinador Administrativo",
      },
    ]);
  });

  test("obtenerUsuariosConRol devuelve valores por defecto cuando falta correo o rol", async () => {
    const usuarios = [
      {
        id_usuario: 3,
        primer_nombre: "María",
        primer_apellido: "González",
        cuenta: null,
        roles: [],
      },
    ];
    repoMock.findAllConRol.mockResolvedValue(usuarios);

    await expect(UsuarioService.obtenerUsuariosConRol()).resolves.toEqual([
      {
        id_usuario: 3,
        nombre: "María González",
        correo: "sin correo",
        rol: "SinRol",
      },
    ]);
  });
});
