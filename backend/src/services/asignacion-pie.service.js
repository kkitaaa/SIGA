import { eventBus } from "../events/eventBus.js";
import { EstudianteRepository } from "../repositories/estudiante.repository.js";

const crearError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export class AsignacionPieService {
  constructor({ asignacionPieRepository, funcionarioRepository, prismaClient }) {
    this.asignacionPieRepository = asignacionPieRepository;
    this.funcionarioRepository = funcionarioRepository; // instancia
    this.prismaClient = prismaClient;
  }

  async crearAsignacion({ idEstudiante, idFuncionario, idUsuario }) {
    const asignacionActiva =
      await this.asignacionPieRepository.findActiveByStudent(idEstudiante);

    if (asignacionActiva) {
      throw crearError("El estudiante ya tiene una asignacion PIE activa", 409);
    }

    // ✅ EstudianteRepository se usa como clase estática
    const estudiante = await EstudianteRepository.findById(idEstudiante);
    if (!estudiante) {
      throw crearError("El estudiante no existe", 404);
    }

    // ✅ FuncionarioRepository se usa como instancia
    const funcionario = await this.funcionarioRepository.findPieMemberByUserId(idFuncionario);
    if (!funcionario) {
      throw crearError("El funcionario PIE no existe", 404);
    }

    const asignacion = await this.prismaClient.$transaction(async (tx) => {
      const nuevaAsignacion = await this.asignacionPieRepository.create(
        { idEstudiante, idFuncionario },
        tx,
      );

      await EstudianteRepository.updateNeeStatus(idEstudiante, true, tx);

      return nuevaAsignacion;
    });

    eventBus.emit("asignacionPIE", {
      usuarioId: idUsuario,
      estudianteId: idEstudiante,
      funcionarioId: idFuncionario,
      accion: "CREAR",
      fecha: new Date(),
    });

    return {
      ok: true,
      mensaje: "Asignación PIE registrada correctamente",
      data: asignacion,
    };
  }

  async listarAsignaciones() {
    return this.asignacionPieRepository.findAll();
  }

  async obtenerAsignacion(idAsignacion) {
    const asignacion = await this.asignacionPieRepository.findById(idAsignacion);
    if (!asignacion) {
      throw crearError("La asignacion PIE no existe", 404);
    }
    return asignacion;
  }

  async finalizarAsignacion(idAsignacion, idUsuario) {
    const asignacion = await this.asignacionPieRepository.findById(idAsignacion);
    if (!asignacion) {
      throw crearError("La asignacion PIE no existe", 404);
    }

    const asignacionFinalizada = await this.prismaClient.$transaction(async (tx) => {
      const finalizada = await this.asignacionPieRepository.finalizar(idAsignacion, tx);

      const mantieneAsignaciones =
        await this.asignacionPieRepository.findActiveByStudentExcluding(
          asignacion.id_estudiante,
          idAsignacion,
          tx,
        );

      if (!mantieneAsignaciones) {
        await EstudianteRepository.updateNeeStatus(asignacion.id_estudiante, false, tx);
      }

      return finalizada;
    });

    eventBus.emit("asignacionPIE", {
      usuarioId: idUsuario,
      estudianteId: asignacion.id_estudiante,
      funcionarioId: asignacion.id_funcionario,
      accion: "ELIMINAR",
      fecha: new Date(),
    });

    return {
      ok: true,
      mensaje: "Asignación PIE finalizada correctamente",
      data: asignacionFinalizada,
    };
  }
}
