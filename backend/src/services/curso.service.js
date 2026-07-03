export class CursoService {
  constructor(cursoRepository) {
    this.repository = cursoRepository;
  }

  async crearCurso(dto) {
    const cursoExistente = await this.repository.findByDetalles(
      dto.nivel_educativo,
      dto.nivel_curso,
      dto.letra,
    );

    if (cursoExistente) {
      throw new Error(
        "BUSINESS_ERROR: Ya existe un curso registrado con este nivel y letra",
      );
    }

    return await this.repository.create(dto);
  }

  async obtenerCursos() {
    return await this.repository.findAll();
  }

  async obtenerCursoPorId(id) {
    const curso = await this.repository.findById(id);

    if (!curso) {
      throw new Error("Curso no encontrado");
    }

    return curso;
  }

  async obtenerProfesorPorUsuario(idUsuario) {
    return await this.repository.findProfesorByUsuario(idUsuario);
  }

  async obtenerCursosPorProfesor(idProfesor) {
    return await this.repository.findByProfesorId(idProfesor);
  }
}
