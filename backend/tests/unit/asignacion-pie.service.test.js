import { jest } from "@jest/globals";

let AsignacionPieService;

beforeAll(async () => {
  ({ AsignacionPieService } =
    await import("../../src/services/asignacion-pie.service.js"));
});

const crearService = ({
  estudiante = {
    id_estudiante: 15,
    usuario: {
      cuenta: {
        estado: "ACTIVO",
      },
    },
  },
  funcionario = {
    id_usuario: 8,
  },
  asignacionActiva = null,
  asignacion = {
    id_asignacion: 1,
    id_estudiante: 15,
    id_funcionario: 8,
    estado: "ACTIVA",
  },
  mantieneAsignaciones = null,
} = {}) => {
  const asignacionPieRepository = {
    findActiveByStudent: jest.fn().mockResolvedValue(asignacionActiva),

    findActiveByStudentExcluding: jest
      .fn()
      .mockResolvedValue(mantieneAsignaciones),

    create: jest.fn().mockResolvedValue(asignacion),

    findAll: jest.fn().mockResolvedValue([asignacion]),

    findById: jest.fn().mockResolvedValue(asignacion),

    finalizar: jest.fn().mockResolvedValue({
      ...asignacion,
      estado: "FINALIZADA",
    }),
  };

  const estudianteRepository = {
    findById: jest.fn().mockResolvedValue(estudiante),

    updateNeeStatus: jest.fn().mockResolvedValue({}),
  };

  const funcionarioRepository = {
    findPieMemberByUserId: jest.fn().mockResolvedValue(funcionario),
  };

  const tx = {};

  const prismaClient = {
    $transaction: jest.fn((callback) => callback(tx)),
  };

  return {
    service: new AsignacionPieService({
      asignacionPieRepository,
      estudianteRepository,
      funcionarioRepository,
      prismaClient,
    }),

    asignacionPieRepository,
    estudianteRepository,
    funcionarioRepository,
    prismaClient,
    tx,
  };
};

describe("AsignacionPieService", () => {
  test("crea una asignacion PIE y marca al estudiante como NEE en una transaccion", async () => {
    const {
      service,
      asignacionPieRepository,
      estudianteRepository,
      prismaClient,
      tx,
    } = crearService();

    const resultado = await service.crearAsignacion({
      idEstudiante: 15,
      idFuncionario: 8,
    });

    expect(resultado.ok).toBe(true);

    expect(resultado.mensaje).toBe("Asignación PIE registrada correctamente");

    expect(prismaClient.$transaction).toHaveBeenCalledTimes(1);

    expect(asignacionPieRepository.create).toHaveBeenCalledWith(
      {
        idEstudiante: 15,
        idFuncionario: 8,
      },
      tx,
    );

    expect(estudianteRepository.updateNeeStatus).toHaveBeenCalledWith(
      15,
      true,
      tx,
    );
  });

  test("rechaza crear una segunda asignacion PIE activa para el mismo estudiante", async () => {
    const { service, prismaClient } = crearService({
      asignacionActiva: {
        id_asignacion: 99,
        estado: "ACTIVA",
      },
    });

    await expect(
      service.crearAsignacion({
        idEstudiante: 15,
        idFuncionario: 8,
      }),
    ).rejects.toMatchObject({
      message: "El estudiante ya tiene una asignacion PIE activa",
      statusCode: 409,
    });

    expect(prismaClient.$transaction).not.toHaveBeenCalled();
  });

  test("finaliza una asignacion y desmarca NEE si no quedan asignaciones activas", async () => {
    const {
      service,
      asignacionPieRepository,
      estudianteRepository,
      prismaClient,
      tx,
    } = crearService();

    const resultado = await service.finalizarAsignacion(1);

    expect(resultado.ok).toBe(true);

    expect(resultado.mensaje).toBe("Asignación PIE finalizada correctamente");

    expect(prismaClient.$transaction).toHaveBeenCalledTimes(1);

    expect(asignacionPieRepository.finalizar).toHaveBeenCalledWith(1, tx);

    expect(estudianteRepository.updateNeeStatus).toHaveBeenCalledWith(
      15,
      false,
      tx,
    );
  });

  test("rechaza crear asignacion cuando el estudiante no existe", async () => {
    const { service, prismaClient } = crearService({ estudiante: null });

    await expect(
      service.crearAsignacion({
        idEstudiante: 15,
        idFuncionario: 8,
      }),
    ).rejects.toMatchObject({
      message: "El estudiante no existe",
      statusCode: 404,
    });

    expect(prismaClient.$transaction).not.toHaveBeenCalled();
  });

  test("rechaza crear asignacion cuando el funcionario PIE no existe", async () => {
    const { service, prismaClient } = crearService({ funcionario: null });

    await expect(
      service.crearAsignacion({
        idEstudiante: 15,
        idFuncionario: 8,
      }),
    ).rejects.toMatchObject({
      message: "El funcionario PIE no existe",
      statusCode: 404,
    });

    expect(prismaClient.$transaction).not.toHaveBeenCalled();
  });

  test("finaliza una asignacion sin desmarcar NEE si aún existen otras activas", async () => {
    const { service, estudianteRepository, prismaClient } = crearService({
      mantieneAsignaciones: { id_asignacion: 2 },
    });

    await service.finalizarAsignacion(1);

    expect(prismaClient.$transaction).toHaveBeenCalledTimes(1);
    expect(estudianteRepository.updateNeeStatus).not.toHaveBeenCalled();
  });

  test("obtiene una asignacion y rechaza si no existe", async () => {
    const { service } = crearService({ asignacion: null });

    await expect(service.obtenerAsignacion(1)).rejects.toMatchObject({
      message: "La asignacion PIE no existe",
      statusCode: 404,
    });
  });
});
