import { jest } from "@jest/globals";

const mockRepository = {
  findByRut: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findAllNee: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

jest.unstable_mockModule("../../src/repositories/estudiante.repository.js", () => ({
  EstudianteRepository: mockRepository,
}));

let EstudianteService;

beforeAll(async () => {
  ({ EstudianteService } = await import("../../src/services/estudiante.service.js"));
});

describe("EstudianteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registra un estudiante cuando el RUT no existe", async () => {
    const estudianteCreado = { id_estudiante: 7, rut: "12345678-9" };
    mockRepository.findByRut.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(estudianteCreado);

    const dto = {
      rut: "12345678-9",
      primer_nombre: "Juan",
      segundo_nombre: "Pablo",
      primer_apellido: "Pérez",
      segundo_apellido: "González",
      sexo: "Masculino",
      fecha_nacimiento: "2015-04-12",
      fecha_ingreso: "2026-03-01",
      id_curso: 3,
    };

    await expect(EstudianteService.registrarEstudiante(dto)).resolves.toEqual(
      estudianteCreado,
    );

    expect(mockRepository.findByRut).toHaveBeenCalledWith(dto.rut);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        rut: dto.rut,
        es_nee: false,
      }),
    );
  });

  test("rechaza el registro si ya existe un estudiante con el mismo RUT", async () => {
    mockRepository.findByRut.mockResolvedValue({ id_estudiante: 1 });

    await expect(
      EstudianteService.registrarEstudiante({ rut: "12345678-9" }),
    ).rejects.toThrow(
      "BUSINESS_ERROR: Ya existe un estudiante registrado con este RUT",
    );

    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  test("lista todos los estudiantes", async () => {
    const estudiantes = [{ id_estudiante: 1 }];
    mockRepository.findAll.mockResolvedValue(estudiantes);

    await expect(EstudianteService.listarEstudiantes()).resolves.toEqual(
      estudiantes,
    );
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test("lista los estudiantes NEE", async () => {
    const estudiantesNee = [{ id_estudiante: 2, es_nee: true }];
    mockRepository.findAllNee.mockResolvedValue(estudiantesNee);

    await expect(EstudianteService.listarEstudiantesNee()).resolves.toEqual(
      estudiantesNee,
    );
    expect(mockRepository.findAllNee).toHaveBeenCalledTimes(1);
  });

  test("obtiene un estudiante por ID cuando el identificador es válido", async () => {
    const estudiante = { id_estudiante: 10 };
    mockRepository.findById.mockResolvedValue(estudiante);

    await expect(EstudianteService.obtenerEstudiantePorId(10)).resolves.toEqual(
      estudiante,
    );
    expect(mockRepository.findById).toHaveBeenCalledWith(10);
  });

  test("rechaza la búsqueda por ID cuando el identificador es inválido", async () => {
    await expect(EstudianteService.obtenerEstudiantePorId("abc")).rejects.toThrow(
      TypeError,
    );
    await expect(EstudianteService.obtenerEstudiantePorId("abc")).rejects.toThrow(
      "VALIDATION_ERROR: ID inválido",
    );
  });

  test("rechaza la búsqueda por ID cuando el estudiante no existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(EstudianteService.obtenerEstudiantePorId(99)).rejects.toThrow(
      "BUSINESS_ERROR: Estudiante no encontrado",
    );
  });

  test("actualiza un estudiante cuando existe", async () => {
    const estudianteActualizado = { id_estudiante: 10 };
    mockRepository.findById.mockResolvedValue({ id_estudiante: 10 });
    mockRepository.update.mockResolvedValue(estudianteActualizado);

    const dto = {
      primer_nombre: "Ana",
      segundo_nombre: "María",
      primer_apellido: "Soto",
      segundo_apellido: "López",
      sexo: "Femenino",
      fecha_nacimiento: "2016-10-02",
      fecha_ingreso: "2026-03-01",
      id_curso: 4,
      es_nee: true,
    };

    await expect(EstudianteService.actualizarEstudiante(10, dto)).resolves.toEqual(
      estudianteActualizado,
    );

    expect(mockRepository.update).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        primer_nombre: dto.primer_nombre,
        es_nee: true,
      }),
    );
  });

  test("rechaza la actualización si el ID es inválido", async () => {
    await expect(EstudianteService.actualizarEstudiante("x", {})).rejects.toThrow(
      "VALIDATION_ERROR: ID inválido",
    );
  });

  test("rechaza la actualización si el estudiante no existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(EstudianteService.actualizarEstudiante(20, {})).rejects.toThrow(
      "BUSINESS_ERROR: Estudiante no encontrado",
    );
  });
});
