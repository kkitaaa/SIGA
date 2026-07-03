import { jest } from "@jest/globals";

const repoMock = {
  findByRut: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findAllNee: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

jest.unstable_mockModule("../../src/repositories/estudiante.repository.js", () => ({
  EstudianteRepository: repoMock,
}));

let EstudianteService;

beforeAll(async () => {
  ({ EstudianteService } = await import("../../src/services/estudiante.service.js"));
});

describe("EstudianteService integration", () => {
  beforeEach(() => jest.clearAllMocks());

  test("registrar estudiante exitoso", async () => {
    repoMock.findByRut.mockResolvedValue(null);
    repoMock.create.mockResolvedValue({ id_estudiante: 1, rut: "1-9" });

    const dto = { rut: "1-9", primer_nombre: "Juan" };

    const res = await EstudianteService.registrarEstudiante(dto);

    expect(res).toEqual({ id_estudiante: 1, rut: "1-9" });
    expect(repoMock.create).toHaveBeenCalled();
  });

  test("registrar lanza error si ya existe estudiante", async () => {
    repoMock.findByRut.mockResolvedValue({ id_estudiante: 2 });

    await expect(
      EstudianteService.registrarEstudiante({ rut: "2-7" }),
    ).rejects.toThrow("BUSINESS_ERROR: Ya existe un estudiante registrado con este RUT");
  });

  test("obtenerEstudiantePorId valida id y no existe", async () => {
    await expect(EstudianteService.obtenerEstudiantePorId("abc")).rejects.toThrow(
      "VALIDATION_ERROR: ID inválido",
    );

    repoMock.findById.mockResolvedValue(null);
    await expect(EstudianteService.obtenerEstudiantePorId(999)).rejects.toThrow(
      "BUSINESS_ERROR: Estudiante no encontrado",
    );
  });

  test("actualizarEstudiante exitoso", async () => {
    repoMock.findById.mockResolvedValue({ id_estudiante: 3 });
    repoMock.update.mockResolvedValue({ id_estudiante: 3, primer_nombre: "Updated" });

    const res = await EstudianteService.actualizarEstudiante(3, { primer_nombre: "Updated" });

    expect(res).toEqual({ id_estudiante: 3, primer_nombre: "Updated" });
    expect(repoMock.update).toHaveBeenCalledWith(3, expect.any(Object));
  });
});
