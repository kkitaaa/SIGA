import { jest } from "@jest/globals";

let AsignacionPieService;
let eventBus;

beforeAll(async () => {
  ({ AsignacionPieService } =
    await import("../../src/services/asignacion-pie.service.js"));

  ({ eventBus } = await import("../../src/events/eventBus.js"));
});

describe("AsignacionPieService integration scenarios", () => {
  test("crearAsignacion lanza 409 si ya existe asignacion activa", async () => {
    const service = new AsignacionPieService({
      asignacionPieRepository: { findActiveByStudent: () => ({ id: 1 }) },
      estudianteRepository: {},
      funcionarioRepository: {},
      prismaClient: {},
    });

    await expect(
      service.crearAsignacion({
        idEstudiante: 1,
        idFuncionario: 2,
        idUsuario: 3,
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test("crearAsignacion lanza 404 si estudiante no existe", async () => {
    const service = new AsignacionPieService({
      asignacionPieRepository: { findActiveByStudent: () => null },
      estudianteRepository: { findById: () => null },
      funcionarioRepository: {},
      prismaClient: {},
    });

    await expect(
      service.crearAsignacion({
        idEstudiante: 10,
        idFuncionario: 2,
        idUsuario: 3,
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("crearAsignacion lanza 404 si funcionario no existe", async () => {
    const service = new AsignacionPieService({
      asignacionPieRepository: { findActiveByStudent: () => null },
      estudianteRepository: { findById: () => ({ id: 10 }) },
      funcionarioRepository: { findPieMemberByUserId: () => null },
      prismaClient: {},
    });

    await expect(
      service.crearAsignacion({
        idEstudiante: 10,
        idFuncionario: 2,
        idUsuario: 3,
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("crearAsignacion exitoso emite evento y retorna data", async () => {
    const created = { id: 5, id_estudiante: 10, id_funcionario: 2 };

    const asignacionPieRepository = {
      findActiveByStudent: () => null,
      create: async (payload, tx) => created,
    };

    const estudianteRepository = {
      findById: () => ({ id: 10 }),
      updateNeeStatus: jest.fn(),
    };

    const funcionarioRepository = { findPieMemberByUserId: () => ({ id: 2 }) };

    const prismaClient = {
      $transaction: async (cb) => cb({}),
    };

    const spy = jest.spyOn(eventBus, "emit");

    const service = new AsignacionPieService({
      asignacionPieRepository,
      estudianteRepository,
      funcionarioRepository,
      prismaClient,
    });

    const res = await service.crearAsignacion({
      idEstudiante: 10,
      idFuncionario: 2,
      idUsuario: 99,
    });

    expect(res.ok).toBe(true);
    expect(res.data).toBe(created);
    expect(estudianteRepository.updateNeeStatus).toHaveBeenCalledWith(
      10,
      true,
      expect.anything(),
    );
    expect(spy).toHaveBeenCalledWith(
      "asignacionPIE",
      expect.objectContaining({ usuarioId: 99 }),
    );

    spy.mockRestore();
  });

  test("finalizarAsignacion lanza 404 si no existe asignacion", async () => {
    const service = new AsignacionPieService({
      asignacionPieRepository: { findById: () => null },
      estudianteRepository: {},
      funcionarioRepository: {},
      prismaClient: {},
    });

    await expect(service.finalizarAsignacion(1, 2)).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test("finalizarAsignacion exitoso actualiza NEE cuando no quedan asignaciones", async () => {
    const asignacion = { id: 7, id_estudiante: 20, id_funcionario: 3 };

    const asignacionPieRepository = {
      findById: () => asignacion,
      finalizar: async (id, tx) => ({ id }),
      findActiveByStudentExcluding: async () => false,
    };

    const estudianteRepository = { updateNeeStatus: jest.fn() };

    const prismaClient = { $transaction: async (cb) => cb({}) };

    const spy = jest.spyOn(eventBus, "emit");

    const service = new AsignacionPieService({
      asignacionPieRepository,
      estudianteRepository,
      funcionarioRepository: {},
      prismaClient,
    });

    const res = await service.finalizarAsignacion(7, 42);

    expect(res.ok).toBe(true);
    expect(estudianteRepository.updateNeeStatus).toHaveBeenCalledWith(
      20,
      false,
      expect.anything(),
    );
    expect(spy).toHaveBeenCalledWith(
      "asignacionPIE",
      expect.objectContaining({ usuarioId: 42 }),
    );

    spy.mockRestore();
  });

  test("finalizarAsignacion no actualiza NEE si quedan asignaciones", async () => {
    const asignacion = { id: 9, id_estudiante: 21, id_funcionario: 4 };

    const asignacionPieRepository = {
      findById: () => asignacion,
      finalizar: async (id, tx) => ({ id }),
      findActiveByStudentExcluding: async () => true,
    };

    const estudianteRepository = { updateNeeStatus: jest.fn() };

    const prismaClient = { $transaction: async (cb) => cb({}) };

    const spy = jest.spyOn(eventBus, "emit");

    const service = new AsignacionPieService({
      asignacionPieRepository,
      estudianteRepository,
      funcionarioRepository: {},
      prismaClient,
    });

    const res = await service.finalizarAsignacion(9, 55);

    expect(res.ok).toBe(true);
    expect(estudianteRepository.updateNeeStatus).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      "asignacionPIE",
      expect.objectContaining({ usuarioId: 55 }),
    );

    spy.mockRestore();
  });
});
