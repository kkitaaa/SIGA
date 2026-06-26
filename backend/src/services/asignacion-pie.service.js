const crearError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

export class AsignacionPieService {
  constructor({
    asignacionPieRepository,
    estudianteRepository,
    funcionarioRepository,
    prismaClient,
  }) {
    this.asignacionPieRepository = asignacionPieRepository;
    this.estudianteRepository = estudianteRepository;
    this.funcionarioRepository = funcionarioRepository;
    this.prismaClient = prismaClient;
  }

  async crearAsignacion({ idEstudiante, idFuncionario }) {
    const asignacionActiva =
      await this.asignacionPieRepository.findActiveByStudent(idEstudiante);

    if (asignacionActiva) {
      throw crearError("El estudiante ya tiene una asignacion PIE activa", 409);
    }

    const estudiante = await this.estudianteRepository.findById(idEstudiante);

    if (!estudiante) {
      throw crearError("El estudiante no existe", 404);
    }

    const funcionario =
      await this.funcionarioRepository.findPieMemberByUserId(idFuncionario);

    if (!funcionario) {
      throw crearError("El funcionario PIE no existe", 404);
    }

    const asignacion = await this.prismaClient.$transaction(async (tx) => {
      const nuevaAsignacion = await this.asignacionPieRepository.create(
        {
          idEstudiante,
          idFuncionario,
        },
        tx,
      );

      await this.estudianteRepository.updateNeeStatus(idEstudiante, true, tx);

      return nuevaAsignacion;
    });

    return {
      ok: true,
      mensaje: "Asignaci\u00f3n PIE registrada correctamente",
      data: asignacion,
    };
  }

  async listarAsignaciones() {
    return this.asignacionPieRepository.findAll();
  }

  async obtenerAsignacion(idAsignacion) {
    const asignacion =
      await this.asignacionPieRepository.findById(idAsignacion);

    if (!asignacion) {
      throw crearError("La asignacion PIE no existe", 404);
    }

    return asignacion;
  }

  async finalizarAsignacion(idAsignacion) {
    const asignacion =
      await this.asignacionPieRepository.findById(idAsignacion);

    if (!asignacion) {
      throw crearError("La asignacion PIE no existe", 404);
    }

    const asignacionFinalizada = await this.prismaClient.$transaction(
      async (tx) => {
        const finalizada = await this.asignacionPieRepository.finalizar(
          idAsignacion,
          tx,
        );

        const mantieneAsignaciones =
          await this.asignacionPieRepository.findActiveByStudentExcluding(
            asignacion.id_estudiante,
            idAsignacion,
            tx,
          );

        if (!mantieneAsignaciones) {
          await this.estudianteRepository.updateNeeStatus(
            asignacion.id_estudiante,
            false,
            tx,
          );
        }

        return finalizada;
      },
    );

    return {
      ok: true,
      mensaje: "Asignaci\u00f3n PIE finalizada correctamente",
      data: asignacionFinalizada,
    };
  }
}
