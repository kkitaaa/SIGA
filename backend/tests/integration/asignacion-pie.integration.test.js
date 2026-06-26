let validarCrearAsignacionPIEDto;
let AsignacionPieService;

beforeAll(async () => {
  ({ validarCrearAsignacionPIEDto } =
    await import("../../src/dto/asignacion-pie.dto.js"));

  ({ AsignacionPieService } =
    await import("../../src/services/asignacion-pie.service.js"));
});

describe("Asignacion PIE integration contract", () => {
  test("valida el payload esperado para crear asignaciones PIE", () => {
    const resultado = validarCrearAsignacionPIEDto({
      idEstudiante: 15,
      idFuncionario: 8,
    });

    expect(resultado).toEqual({
      valido: true,
      errores: [],
      data: {
        idEstudiante: 15,
        idFuncionario: 8,
      },
    });
  });

  test("expone los metodos requeridos por los endpoints PIE", () => {
    const service = new AsignacionPieService({
      asignacionPieRepository: {},
      estudianteRepository: {},
      funcionarioRepository: {},
      prismaClient: {},
    });

    expect(typeof service.crearAsignacion).toBe("function");

    expect(typeof service.listarAsignaciones).toBe("function");

    expect(typeof service.obtenerAsignacion).toBe("function");

    expect(typeof service.finalizarAsignacion).toBe("function");
  });
});
